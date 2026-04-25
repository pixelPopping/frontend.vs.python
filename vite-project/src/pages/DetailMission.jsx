import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
                    <button className="submit" style={{width: 'auto', background: '#11D8E8', color: 'black'}} onClick={() => navigate('/mission')}>
                        Terug naar Planner
                    </button>
                </div>
                <div className="inner-form">
                    {missions.length > 0 ? (
                        missions.map((m, index) => (
                            <div key={index} className="mission-display" style={{ padding: '20px', border: '3px dashed #11D8E8', background: '#272727', color: 'white', marginBottom: '20px', position: 'relative' }}>
                                <button 
                                    onClick={() => handleDelete(index)} 
                                    className="submit" 
                                    style={{ position: 'absolute', top: '10px', right: '10px', background: 'red', width: 'auto' }}
                                >
                                    Delete
                                </button>
                                
                                <h3>🚀 Missie #{index + 1}</h3>
                                <p><strong>Periode:</strong> {m.departure} t/m {m.returnDate}</p>
                                <p><strong>Captain:</strong> {m.captain}</p>
                                
                                {/* Toegevoegde velden: Crew, Launchpad en Landingpad */}
                                <p><strong>Crew:</strong> {m.crewMember1} & {m.crewMember2}</p>
                                <p><strong>Rocket:</strong> {m.rocket}</p>
                                <p><strong>Launch Pad:</strong> {m.launchPad}</p>
                                <p><strong>Landing Pad:</strong> {m.landingPad}</p>
                                
                                <p><strong>Destination:</strong> {m.city}</p>
                                <p><strong>Strategy:</strong> {m.marsAction}</p>
                            </div>
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
