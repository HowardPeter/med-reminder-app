import { createContext, useEffect, useState, useContext, useCallback, useMemo } from "react";
import { createUserWithEmailAndPassword, deleteUser, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
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
            setUser((prevUser) => ({ ...prevUser, username: data.username, userId: data.userId }));
        }
    }, []);

    const login = useCallback(async (email, password) => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
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
                    console.log('user is not verified');
                } else {
                    await setDoc(doc(db, "users", user.uid), {
                        username,
                        userId: user.uid,
                        userEmail: user.email,
                    });
                    console.log('User created:', user);
                }
            }, 2 * 60 * 1000);
            return { success: true, data: user };
        } catch (error) {
            let msg = error.message;
            if (msg.includes('auth/invalid-email')) msg = 'Email is invalid';
            if (msg.includes('auth/email-already-in-use')) msg = 'This email is already in use';
            if (msg.includes('auth/weak-password')) msg = 'Password should be at least 6 characters.';
            if (msg.includes('auth/network-request-failed')) msg = 'Network error, please try again later';
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

    const authValue = useMemo(() => ({
        user,
        isAuthenticated,
        verified,
        login,
        logout,
        register,
        checkIfEmailExists,
        resetPassword
    }), [user, isAuthenticated, verified, login, logout, register, checkIfEmailExists, resetPassword]);

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