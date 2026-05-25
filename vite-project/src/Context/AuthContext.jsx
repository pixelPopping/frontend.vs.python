import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const API = "http://localhost:5000";

export default function AuthContextProvider({ children }) {

    const [isAuth, setIsAuth] = useState(false);

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

   
    useEffect(() => {

        const token = localStorage.getItem("token");

        
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

            setUser(res.data);

            setIsAuth(true);
        })
        .catch(() => {

           
            localStorage.removeItem("token");

            setUser(null);

            setIsAuth(false);
        })
        .finally(() => {

            setLoading(false);
        });

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

        <AuthContext.Provider value={{

            isAuth,
            user,
            loading,
            login,
            logout

        }}>

            {children}

        </AuthContext.Provider>
    );
}