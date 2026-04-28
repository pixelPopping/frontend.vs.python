import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MissionDetailCard from '../components/MissionDetailCard';

function DetailMission() {
    const [missions, setMissions] = useState([]);
    const navigate = useNavigate();

    const fetchMissions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/missions');
            setMissions(response.data);
        } catch (error) {
            console.error("Fout bij ophalen missies:", error);
        }
    };

    useEffect(() => {
        const source = axios.CancelToken.source();
        axios.get('http://localhost:5000/api/missions', { cancelToken: source.token })
            .then(res => setMissions(res.data))
            .catch(err => { if (!axios.isCancel(err)) console.error(err); });
        
        return () => source.cancel("Component unmounted");
    }, []);

    const handleDelete = async (index) => {
        try {
            await axios.delete(`http://localhost:5000/api/missions/${index}`);
            fetchMissions();
        } catch (error) {
            console.error("Fout bij verwijderen:", error);
        }
    };

    return (
        <main className="main-outer-form">
            <div className="outer-form">
                <div className="text-container">
                    <h1>Mission History</h1>
                    <button 
                        className="submit" 
                        style={{width: 'auto', background: '#11D8E8', color: 'black'}} 
                        onClick={() => navigate('/mission')}
                    >
                        Terug naar Planner
                    </button>
                </div>

                <div className="inner-form">
                    {missions.length > 0 ? (
                        missions.map((m, index) => (
                            <MissionDetailCard
                                key={index}
                                index={index}
                                label={"Mission#"}
                                text={m}              
                                onClick={() => handleDelete(index)}  
                            />
                        ))
                    ) : (
                        <p style={{textAlign: 'center'}}>Geen missies gevonden in de database.</p>
                    )}
                </div>
            </div>
        </main>
    );
}

export default DetailMission;
