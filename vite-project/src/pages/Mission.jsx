import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import MissionForm from '../components/MissionForm';

const Mission = () => {
    const [options, setOptions] = useState({ astronauts: [], rockets: [], launches: [], landpads: [] });
    const [missionResult, setMissionResult] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    
    // De datums die we vanuit Home.jsx hebben meegestuurd
    const travelDates = location.state;

    useEffect(() => {
        axios.get('http://localhost:5000/api/mission-options')
            .then(res => setOptions(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleFormSubmit = async (formData) => {
        const fullPayload = {
            ...formData,
            departure: travelDates?.departure || "Niet opgegeven",
            returnDate: travelDates?.returnDate || "Niet opgegeven"
        };

        try {
            const response = await axios.post('http://localhost:5000/api/launch', fullPayload);
            setMissionResult({ message: response.data.message, details: fullPayload });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="main-outer-form">
            <MissionForm onSubmit={handleFormSubmit} options={options} isSuccess={!!missionResult} />
            
            <button className="submit" style={{width: 'auto', marginTop: '20px', background: '#444'}} onClick={() => navigate('/detailmission')}>
                Bekijk Alle Missies
            </button>

            {missionResult && (
                <div className="mission-display" style={{ marginTop: '20px', padding: '20px', border: '3px dashed #11D8E8', background: '#272727', color: 'white', width: '80%' }}>
                    <h3>🚀 Mission Manifest</h3>
                    <p><strong>Periode:</strong> {missionResult.details.departure} tot {missionResult.details.returnDate}</p>
                    <p><strong>Captain:</strong> {missionResult.details.captain}</p>
                    <p><strong>Crew:</strong> {missionResult.details.crewMember1} & {missionResult.details.crewMember2}</p>
                    <p><strong>Rocket:</strong> {missionResult.details.rocket}</p>
                    <p><strong>Destination:</strong> {missionResult.details.city}</p>
                    <p><strong>Strategy:</strong> {missionResult.details.marsAction}</p>
                    <button onClick={() => setMissionResult(null)} className="submit" style={{width: 'auto', marginTop: '10px'}}>Ok</button>
                </div>
            )}
        </div>
    );
};

export default Mission;
