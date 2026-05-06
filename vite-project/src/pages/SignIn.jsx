import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";
import LoginFields from "../components/LogInFields.jsx";


function LogIn() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = async (data) => {
        setLoading(true);
        setErrorMessage("");

        try {
            const response = await axios.post(
                "http://localhost:5000/api/login",
                {
                    email: data.email,
                    password: data.password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const token = response.data.token;

            // 🔐 laat AuthContext alles regelen
            login(token);

            navigate("/");

        } catch (error) {
            setErrorMessage(
                error.response?.data?.error || "Login failed. Try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="signin-page">
            <header>
                <h1 className="crapshop">CrapShop</h1>
                <h2 className="crapshop">Login</h2>
            </header>

            {errorMessage && <p className="error">{errorMessage}</p>}

            {loading && <p>Logging in...</p>}

            <LoginFields onSubmit={handleFormSubmit} loading={loading} />
        </main>
    );
}

export default LogIn;