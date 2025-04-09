import { createContext, useEffect, useState, useContext, useCallback, useMemo } from "react";
import { createUserWithEmailAndPassword, deleteUser, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export const CrudContext = createContext();

export const CrudContextProvider = ({ children }) => {

    const fetchData = () => {

    }

    const addPrescription = () => {

    }

    const updatePrescription = () => {

    }

    const deletePrescription = () => {

    }

    const crudValue = useMemo(() => ({
        fetchData,
        addPrescription,
        updatePrescription,
        deletePrescription,
    }), [fetchData, addPrescription, updatePrescription, deletePrescription]);
    return (
        <CrudContext.Provider value={crudValue}>
            {children}
        </CrudContext.Provider>
    );
}

export const useCrud = () => {
    const value = useContext(CrudContext);

    if (!value) {
        throw new Error("useCrud must be used within an CrudContextProvider");
    }

    return value;
}