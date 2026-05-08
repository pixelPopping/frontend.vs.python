import { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import LogInFields from '../components/RegisterFields';

const API = 'http://localhost:5000';

function SignIn() {
    const { login } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    async function handleSubmit(data) {
        setLoading(true);
        setErrorMessage('');

        try {
            const response = await axios.post(`${API}/api/login`, {
                email: data.email,
                password: data.password,
            });

            login(response.data.token);

        } catch (error) {
            console.error(error);
            setErrorMessage('Invalid credentials');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main>
            <h1>Login</h1>

            <LogInFields
                onSubmit={handleSubmit}
                loading={loading}
                errorMessage={errorMessage}
            />
        </main>
    );
}

export default SignIn;