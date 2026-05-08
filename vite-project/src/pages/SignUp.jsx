import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RegisterFields from '../components/RegisterFields';

const API = 'http://localhost:5000';

function SignUp() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    async function handleSubmit(data) {

        setLoading(true);
        setErrorMessage('');

        try {

            await axios.post(`${API}/api/register`, {
                firstname: data.firstname,
                lastname: data.lastname,
                city: data.city,
                phone: data.phone,
                email: data.email,
                password: data.password,
                inviteCode: data.inviteCode,
            });

            navigate('/signin');

        } catch (error) {
            console.error(error);
            setErrorMessage('Registration failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main>
            <h1>Register</h1>

            <RegisterFields
                onSubmit={handleSubmit}
                loading={loading}
                errorMessage={errorMessage}
            />
        </main>
    );
}

export default SignUp;