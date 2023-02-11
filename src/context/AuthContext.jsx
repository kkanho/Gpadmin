import React, { useEffect } from "react";
import { createContext, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const defaultState = {
    currentUser: JSON.parse(localStorage.getItem("user")) || null 
}

export const AuthContext = createContext(defaultState)


export const AuthContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(AuthReducer, defaultState)

    //whenever currentUser change, store it in localStorage
    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(state.currentUser))
    }, [state.currentUser])

    return (
        <AuthContext.Provider value={{ currentUser: state.currentUser, dispatch }}>
            {children}
        </AuthContext.Provider>
    )

}