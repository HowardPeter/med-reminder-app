import { createContext, useEffect, useState, useContext, useCallback, useMemo } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateEmail } from "firebase/auth"
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await user.reload();
                setIsAuthenticated(true);
                setUser(user);
                setVerified(user.emailVerified);
                updateUserData(user.uid);
            } else {
                setIsAuthenticated(false);
                setUser(null);
                setVerified(false);
            }
        });

        return unsub;
    }, []);

    const updateUserData = useCallback(async (userId) => {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            let data = docSnap.data();
            setUser((prevUser) => ({ ...prevUser, username: data.username, userId: data.userId, userEmail: data.userEmail, userImage: data.userImage, }));
        }
    }, []);

    const login = useCallback(async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error) {
            let msg = error.message;
            if (msg.includes('auth/invalid-email')) msg = 'Email is invalid';
            if (msg.includes('auth/invalid-credential')) msg = 'Wrong email or password';
            if (msg.includes('auth/network-request-failed')) msg = 'Network error, please try again later';
            return { success: false, msg };
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            return { success: false, msg: error.message };
        }
    }, []);

    const register = useCallback(async (username, email, password) => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            const user = response?.user;

            await sendEmailVerification(user);

            setTimeout(async () => {
                await user.reload();
                if (!user.emailVerified) {
                    await deleteUser(user);
                }
            }, 3 * 60 * 1000);

            await setDoc(doc(db, "users", user.uid), {
                username,
                userId: user.uid,
                userEmail: user.email,
                userImage: 'https://pin.it/2da4Xbylp',
            });
            console.log('User created:', user);

            return { success: true, data: user };
        } catch (error) {
            let msg = error.message;
            if (msg.includes('auth/invalid-email')) msg = 'Email is invalid';
            if (msg.includes('auth/email-already-in-use')) msg = 'This email is already in use';
            if (msg.includes('auth/weak-password')) msg = 'Password should be at least 6 characters.';
            return { success: false, msg };
        }
    }, []);

    const checkIfEmailExists = useCallback(async (email) => {
        try {
            console.log("Checking email:", email);
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("userEmail", "==", email));
            const querySnapshot = await getDocs(q);
            return !querySnapshot.empty;
        } catch (error) {
            console.error("Error checking email:", error);
            return false;
        }
    }, []);

    const resetPassword = useCallback(async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            console.log("Password reset email sent successfully.");
            return { success: true };
        } catch (error) {
            console.error("Error sending password reset email:", error.message);
            return { success: false, msg: error.message };
        }
    }, []);

    const updateUserImage = useCallback(async (email, newImageUrl) => {
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("userEmail", "==", email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDocRef = querySnapshot.docs[0].ref;

                await updateDoc(userDocRef, {
                    userImage: newImageUrl,
                });

                setUser(prev => ({
                    ...prev,
                    userImage: newImageUrl
                }));
            } else {
                console.error("Không tìm thấy tài liệu với email này.");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật hình ảnh người dùng:", error);
        }
    }, []);

    const updateUserInfo = useCallback(async (newUsername, newEmail) => {
        try {
            if (!auth.currentUser) {
                throw new Error("No user is currently logged in.");
            }

            const currentUser = auth.currentUser;
            await updateEmail(currentUser, newEmail);

            const usersRef = collection(db, "users");
            const q = query(usersRef, where("userId", "==", currentUser.uid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDocRef = querySnapshot.docs[0].ref;

                await updateDoc(userDocRef, {
                    username: newUsername,
                    userEmail: newEmail,
                });

                // 3. Cập nhật lại state user
                setUser((prev) => ({
                    ...prev,
                    username: newUsername,
                    userEmail: newEmail,
                }));

                return { success: true };
            } else {
                throw new Error("User document not found.");
            }
        } catch (error) {
            console.error("Error updating user info:", error.message);
            let msg = error.message;
            if (msg.includes("auth/email-already-in-use")) msg = "This email is already in use";
            if (msg.includes("auth/invalid-email")) msg = "Invalid email address";
            if (msg.includes("auth/requires-recent-login")) msg = "Please re-login to perform this action";
            return { success: false, msg };
        }
    }, []);


    const authValue = useMemo(() => ({
        user,
        isAuthenticated,
        verified,
        login,
        logout,
        register,
        checkIfEmailExists,
        resetPassword,
        updateUserImage,
        updateUserInfo,
    }), [user, isAuthenticated, verified, login, logout, register, checkIfEmailExists, resetPassword, updateUserImage, updateUserInfo]);

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const value = useContext(AuthContext);
    if (!value) {
        throw new Error("useAuth must be used within an AuthContextProvider");
    }
    return value;
};