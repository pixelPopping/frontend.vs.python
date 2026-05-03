import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import MissionForm from '../components/MissionForm';
import './Mission.css';

const Mission = () => {
    const [options, setOptions] = useState({ astronauts: [], rockets: [], launches: [], landpads: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const travelDates = location.state;

    useEffect(() => {
        axios.get('http://localhost:5000/api/mission-options')
            .then(res => setOptions(res.data))
            .catch(() => setError(true));
    }, []);

    const handleFormSubmit = async (formData) => {
        const fullPayload = {
            ...formData,
            departure: travelDates?.departure || "Niet opgegeven",
            returnDate: travelDates?.returnDate || "Niet opgegeven"
        };

        try {
            setLoading(true);

            const response = await axios.post('http://localhost:5000/api/launch', fullPayload);

            // Backend moet { id: ... } teruggeven
            const missionId = response.data.id;

            // 🚀 JUISTE ROUTE
            navigate(`/rocketlaunch/${missionId}`);

        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='outer-mission'>
        <main className="mission-outer-form">
            <MissionForm 
                onSubmit={handleFormSubmit} 
                options={options} 
                isSuccess={false} 
            />

            {loading && <p>Loading…</p>}
            {error && <p>There go something wrong fetching the data.</p>}
        </main>
        </div>
    );
};

export default Mission;



