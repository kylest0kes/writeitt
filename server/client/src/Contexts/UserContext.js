import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({children}) => {
    const { authToken } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            setError('');

            if (authToken) {
                try {
                    const res = await axios.get('/api/users/current-user', {
                        headers: {
                            Authorization: `Bearer ${authToken}`
                        }
                    });
                    setUser(res.data);
                } catch (err) {
                    console.error(`Failed to fetch user data: ${err}`);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        };
        fetchUserData();
    }, [authToken])

    return (
        <UserContext.Provider value={{ user, setUser, loading, error }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);