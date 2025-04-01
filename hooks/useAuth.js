import { createContext, useEffect, useState, useContext } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signOut, updatePassword } from "firebase/auth"
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
                await user.reload(); // Cập nhật trạng thái mới nhất
                setIsAuthenticated(true);
                setUser(user);
                setVerified(user.emailVerified); // Cập nhật trạng thái verified
                updateUserData(user.uid);
            } else {
                setIsAuthenticated(false);
                setUser(null);
                setVerified(false);
            }
        });

        return unsub;
    }, []);

    const updateUserData = async (userId) => {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            let data = docSnap.data();
            setUser({ ...user, username: data.username, userId: data.userId });
        }
    };

    const login = async (email, password) => {
        try {
            const reponse = await signInWithEmailAndPassword(auth, email, password);
            return { succeses: true };
        } catch (error) {
            let msg = error.message;
            if (msg.includes('auth/invalid-email')) {
                msg = 'Email is invalid';
            }
            if (msg.includes('auth/invalid-credential')) {
                msg = 'Wrong email or password';
            }
            return { success: false, msg };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            return { success: false, msg: error.message };
        }
    };

    const register = async (username, email, password) => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            const user = response?.user;

            await sendEmailVerification(user);

            // Nếu sau 5 phút chưa xác minh, tự động xóa tài khoản, hoặc thêm user vào datastore nếu đã xác minh
            setTimeout(async () => {
                await user.reload();
                if (!user.emailVerified) {
                    await deleteUser(user);
                }
                else if (user.emailVerified) {
                    await setDoc(doc(db, "users", response?.user?.uid), {
                        username,
                        userId: response?.user?.uid
                    });
                }
            }, 2 * 60 * 1000);

            return { success: true, data: user };
        } catch (error) {
            let msg = error.message;
            if (msg.includes('auth/invalid-email')) {
                msg = 'Email is invalid';
            }
            if (msg.includes('auth/email-already-in-use')) {
                msg = 'This email is already in use';
            }
            if (msg.includes('auth/weak-password')) {
                msg = 'Password should be at least 6 characters.';
            }
            return { success: false, msg };
        }
    };

    //ham kiem tra email co ton tai trong firebase khong 
    const checkIfEmailExists = async (email) => {
        try {
            console.log("Checking email:", email);

            const usersRef = collection(db, "users"); // Thay "users" bằng tên collection trong Firestore
            const q = query(usersRef, where("userEmail", "==", email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                console.log("Email exists!");
                return true; // Email đã tồn tại
            } else {
                console.log("Email does not exist.");
                return false; // Email chưa tồn tại
            }
        } catch (error) {
            console.error("Error checking email:", error);
            return false;
        }
    };

    //ham cap nhat mat khau sau khi nhap ma OTP
    const changePassword = async (newPassword) => {
        if (!email) {
            console.error("No user is logged in.");
            return;
        }

        try {
            await updatePassword(email, newPassword);
            console.log("Password updated successfully");
        } catch (error) {
            console.error("Failed to change password:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, verified, login, logout, register, checkIfEmailExists, changePassword }}>
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
}