import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const API = "http://localhost:5000";

export default function AuthContextProvider({ children }) {

    const [isAuth, setIsAuth] = useState(false);

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    // ---------------- CHECK AUTH ----------------
    useEffect(() => {

        const token = localStorage.getItem("token");

        console.log("TOKEN:", token);

        // Geen token aanwezig
        if (!token) {

            setLoading(false);

            return;
        }

        axios.get(`${API}/api/me`, {

            headers: {
                Authorization: `Bearer ${token}`
            }

        })
        .then((res) => {

            console.log("AUTH SUCCESS:", res.data);

            setUser(res.data);

            setIsAuth(true);
        })
        .catch((err) => {

            console.error(
                "AUTH ERROR:",
                err.response?.data || err
            );

            // Verwijder slechte token
            localStorage.removeItem("token");

            // Reset auth state
            setUser(null);

            setIsAuth(false);
        })
        .finally(() => {

            setLoading(false);
        });

    }, []);

    // ---------------- LOGIN ----------------
    function login(userData, token) {

        console.log("LOGIN TOKEN:", token);

        localStorage.setItem("token", token);

        setUser(userData);

        setIsAuth(true);
    }

    // ---------------- LOGOUT ----------------
    function logout() {

        console.log("LOGOUT");

        localStorage.removeItem("token");

        setUser(null);

        setIsAuth(false);
    }

    // ---------------- LOADING ----------------
    if (loading) {

        return (
            <div>
                Loading...
            </div>
        );
    }

    // ---------------- PROVIDER ----------------
    return (

        <AuthContext.Provider
            value={{
                isAuth,
                user,
                loading,
                login,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>
    );
}