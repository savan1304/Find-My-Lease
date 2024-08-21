import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../Firebase/firebaseSetup';
import { onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  loading: true,
  language: 'en', 
  setLanguage: () => {} 
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState('en'); 

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, language, setLanguage }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
