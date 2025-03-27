import { createContext, useEffect, useState, useContext } from "react";
// import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth"
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { auth, db } from "../firebaseConfig";

export const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);

    useEffect(() => {
        setIsAuthenticated(false);
    }, []);

    const login = async (email, password) => {

    };

    const logout = async () => {

    };

    const register = async (email, password, username, profileUrl) => {

    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
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