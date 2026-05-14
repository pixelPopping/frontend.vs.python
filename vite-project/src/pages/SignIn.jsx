import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RegisterFields from '../components/RegisterFields';
import { AuthContext } from '../context/AuthContext';

const API = "http://localhost:5000";

function SignIn() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(data) {
        setLoading(true);
        setErrorMessage("");

        try {
            const response = await axios.post(`${API}/api/login`, {
                email: data.email,
                password: data.password
            });

            // Backend stuurt: { token, user: {...} }
            const { token, user } = response.data;

            // AuthContext vullen
            login(
                {
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    role: user.role
                },
                token
            );

            // Redirect op basis van rol
            if (user.role === "captain") {
                navigate("/captain-dashboard");
            } else {
                navigate("/crew-dashboard");
            }

        } catch (error) {
            const msg = error?.response?.data?.error || "Login failed";
            setErrorMessage(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main>
            <h1>Sign In</h1>

            <RegisterFields
                onSubmit={handleSubmit}
                loading={loading}
                errorMessage={errorMessage}
            />
        </main>
    );
}

export default SignIn;



 