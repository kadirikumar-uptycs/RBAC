import React, { createContext, useState, useContext } from 'react';

const UserRoles = {
    SUPERADMIN: 'SUPERADMIN',
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    USER: 'USER'
};

export const AuthContext = createContext({
    user: null,
    login: () => { },
    logout: () => { },
    isAuthenticated: false
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (credentials) => {
        const mockUsers = {
            [UserRoles.SUPERADMIN]: {
                id: '1',
                email: 'superadmin@example.com',
                name: 'Super Admin',
                role: UserRoles.SUPERADMIN
            },
            [UserRoles.ADMIN]: {
                id: '2',
                email: 'admin@example.com',
                name: 'Admin',
                role: UserRoles.ADMIN
            },
            [UserRoles.MANAGER]: {
                id: '3',
                email: 'manager@example.com',
                name: 'Manager',
                role: UserRoles.MANAGER
            },
            [UserRoles.USER]: {
                id: '4',
                email: 'user@example.com',
                name: 'Regular User',
                role: UserRoles.USER
            }
        };

        const authenticatedUser = mockUsers[credentials.role];
        if (authenticatedUser) {
            setUser(authenticatedUser);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
                UserRoles
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);