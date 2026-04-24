import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MissionForm from '../components/MissionForm';

const Mission = () => {
    const [options, setOptions] = useState({ astronauts: [], rockets: [], launches: [], landpads: [] });
    const [loading, setLoading] = useState(true);
    const [missionResult, setMissionResult] = useState(null);

    useEffect(() => {
        const source = axios.CancelToken.source();
        axios.get('http://localhost:5000/api/mission-options', { cancelToken: source.token })
            .then(res => {
                setOptions(res.data);
                setLoading(false);
            })
            .catch(err => {
                if (!axios.isCancel(err)) setLoading(false);
            });
        return () => source.cancel();
    }, []);

    const handleFormSubmit = async (formData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/launch', formData);
            setMissionResult({ message: response.data.message, details: formData });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="main-outer-form">
            <MissionForm 
                onSubmit={handleFormSubmit} 
                options={options} 
                loading={loading} 
                isSuccess={!!missionResult} 
            />
            
            {missionResult && (
                <div className="mission-display" style={{ marginTop: '20px', padding: '20px', border: '3px dashed #11D8E8', background: '#272727', color: 'white', width: '80%' }}>
                    <h3>🚀 Mission Manifest</h3>
                    <p><strong>Captain:</strong> {missionResult.details.captain}</p>
                    <p><strong>Crew:</strong> {missionResult.details.crewMember1} & {missionResult.details.crewMember2}</p>
                    <p><strong>Rocket:</strong> {missionResult.details.rocket}</p>
                    <p><strong>Route:</strong> {missionResult.details.launchPad} ➔ {missionResult.details.landingPad}</p>
                    <p><strong>Mars Action:</strong> {missionResult.details.marsAction}</p>
                    <button onClick={() => setMissionResult(null)} className="submit" style={{ width: 'auto', marginTop: '10px' }}>Ok</button>
                </div>
            )}
        </div>
    );
};

export default Mission;




