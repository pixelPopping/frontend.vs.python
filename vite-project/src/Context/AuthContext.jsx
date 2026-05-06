import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext({});

function AuthContextProvider({ children }) {
    const navigate = useNavigate();

    const [authState, setAuthState] = useState({
        isAuth: false,
        user: null,
        status: 'pending',
    });

    // 🔄 Check token bij refresh
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decoded = jwtDecode(token);

                // ⏰ check expiration
                if (decoded.exp * 1000 < Date.now()) {
                    logOut();
                    return;
                }

                setAuthState({
                    isAuth: true,
                    user: {
                        id: decoded.userId,
                        role: decoded.role,
                    },
                    status: 'done',
                });
            } catch (error) {
                console.error("Invalid token:", error);
                logOut();
            }
        } else {
            setAuthState({
                isAuth: false,
                user: null,
                status: 'done',
            });
        }
    }, []);

    // 🔐 LOGIN
    function logIn(token) {
        try {
            localStorage.setItem('token', token);

            const decoded = jwtDecode(token);

            setAuthState({
                isAuth: true,
                user: {
                    id: decoded.userId,
                    role: decoded.role,
                },
                status: 'done',
            });

            navigate('/dashboard'); // pas aan naar jouw route
        } catch (error) {
            console.error("Login failed:", error);
        }
    }

    // 🚪 LOGOUT
    function logOut() {
        localStorage.removeItem('token');

        setAuthState({
            isAuth: false,
            user: null,
            status: 'done',
        });

        navigate('/');
    }

    const contextData = {
        isAuth: authState.isAuth,
        user: authState.user,
        role: authState.user?.role,
        login: logIn,
        logout: logOut,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {authState.status === 'pending'
                ? <p>Loading...</p>
                : children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;