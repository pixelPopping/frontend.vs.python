import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const API = "http://localhost:5000";

export default function AuthContextProvider({ children }) {
    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState(null);

    // check token on refresh
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.get(`${API}/api/me`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                setUser(res.data);
                setIsAuth(true);
            })
            .catch(() => {
                localStorage.removeItem("token");
            });
        }
    }, []);

    function login(userData, token) {
        localStorage.setItem("token", token);
        setUser(userData);
        setIsAuth(true);
    }

    function logout() {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuth(false);
    }

    return (
        <AuthContext.Provider value={{ isAuth, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}