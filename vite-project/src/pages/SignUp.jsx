import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RegisterFields from "../components/RegisterFields.jsx";

function SignUp() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleFormSubmit = async (data) => {
        setLoading(true);
        setErrorMessage("");

        try {
            const response = await axios.post(
                "http://localhost:5000/api/register",
                {
                    email: data.email,
                    password: data.password,
                    inviteCode: data.inviteCode, // 👈 belangrijk voor jouw auth systeem
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("User created:", response.data);

            navigate("/signin");
        } catch (error) {
            setErrorMessage(
                error.response?.data?.error ||
                "Registratie mislukt. Probeer opnieuw."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="signup-page">
            <header>
                <h1>Register</h1>
                <p>Create your account</p>
            </header>

            {errorMessage && <p className="error">{errorMessage}</p>}

            <RegisterFields
                onSubmit={handleFormSubmit}
                loading={loading}
            />
        </main>
    );
}

export default SignUp;