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

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setAuthState({
                isAuth: false,
                user: null,
                status: 'done',
            });
            return;
        }

        try {
            const decoded = jwtDecode(token);

            setAuthState({
                isAuth: true,
                user: {
                    id: decoded.userId,
                    email: decoded.email,
                    role: decoded.role,
                },
                status: 'done',
            });

        } catch (error) {
            console.error(error);

            localStorage.removeItem('token');

            setAuthState({
                isAuth: false,
                user: null,
                status: 'done',
            });
        }
    }, []);

    function login(token) {
        localStorage.setItem('token', token);

        const decoded = jwtDecode(token);

        setAuthState({
            isAuth: true,
            user: {
                id: decoded.userId,
                email: decoded.email,
                role: decoded.role,
            },
            status: 'done',
        });

        if (decoded.role === 'captain') {
            navigate('/captain');
        } else {
            navigate('/crew');
        }
    }

    function logout() {
        localStorage.removeItem('token');

        setAuthState({
            isAuth: false,
            user: null,
            status: 'done',
        });

        navigate('/signin');
    }

    const data = {
        isAuth: authState.isAuth,
        user: authState.user,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={data}>
            {authState.status === 'pending'
                ? <p>Loading...</p>
                : children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;