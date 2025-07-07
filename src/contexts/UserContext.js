import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState('d9d4f0e8ce48c32f7465090c9a0011a2'); 
    const [user, setUser] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL 
    const fetchUser = async () => {
        try {
            const response = await fetch(`${API_URL}/users/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            const userData = await response.json();
            setUser(userData);
        } catch (error) {
            console.error("Error fetching user:", error);
            setUser(null); // Clear user data on error
        }
    };

    useEffect(() => {
        fetchUser();
    }, [userId]); // Refetch user when userId changes

    return (
        <UserContext.Provider value={{ userId, setUserId, user, setUser, fetchUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
