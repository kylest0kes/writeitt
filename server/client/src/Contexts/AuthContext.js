import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

    const login = (token) => {
        setAuthToken(token);
        localStorage.setItem('authToken', token);
    }

    const logout  = () => {
        setAuthToken(null);
        localStorage.removeItem('authToken');
    }

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setAuthToken(token);
        }
    }, [])

    return (
        <AuthContext.Provider value={{ authToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
export default AuthContext;