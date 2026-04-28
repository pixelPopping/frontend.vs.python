import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import MissionForm from '../components/MissionForm';
import MissionCard from '../components/MissionCard';
import './Mission.css';

const Mission = () => {
    const [options, setOptions] = useState({ astronauts: [], rockets: [], launches: [], landpads: [] });
    const [missionResult, setMissionResult] = useState(null);
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
            setMissionResult({ message: response.data.message, details: fullPayload });
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="mission-outer-form">

            <MissionForm 
                onSubmit={handleFormSubmit} 
                options={options} 
                isSuccess={!!missionResult} 
            />

            <button className="submit" onClick={() => navigate('/detailmission')}>
                View all Missions 
            </button>

            {loading && <p>Loading…</p>}
            {error && <p>There go something wrong fetching the data.</p>}

            {missionResult && (
                <section className="mission-display">
                    <MissionCard 
                        label="Mission Manifest"
                        text={missionResult.details}
                        onClick={() => setMissionResult(null)}
                    />
                </section>
            )}

        </main>
    );
};

export default Mission;
