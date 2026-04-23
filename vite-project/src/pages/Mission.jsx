import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MissionForm from '../components/MissionForm';

const Mission = () => {
    const [options, setOptions] = useState({ astronauts: [], rockets: [] });
    const [loading, setLoading] = useState(true);
    const [missionResult, setMissionResult] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/mission-options')
            .then(res => {
                setOptions(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleFormSubmit = async (formData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/launch', formData);
            setMissionResult({
                message: response.data.message,
                details: formData
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="page-container">
            <MissionForm onSubmit={handleFormSubmit} options={options} loading={loading} />
            {missionResult && (
                <div className="mission-display" style={{ marginTop: '20px', padding: '20px', border: '1px solid white', background: '#1a1a1a', color: 'white' }}>
                    <h3>Your Space Mission</h3>
                    <p><strong>Bericht:</strong> {missionResult.message}</p>
                    <p><strong>Captain:</strong> {missionResult.details.captain}</p>
                    <p><strong>Raket:</strong> {missionResult.details.rocket}</p>
                </div>
            )}
        </div>
    );
};

export default Mission;


