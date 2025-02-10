import React, { createContext, useContext } from 'react';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // const { data: user, error } = useSWR('/api/user', fetcher);
    const user = {
        "userName": "John Doe",
        "role": "operator",
        "department": "Production"
    };
    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
