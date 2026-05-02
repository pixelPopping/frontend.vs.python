import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import MissionDetailCard from '../components/MissionDetailCard';
import './DetailMission.css';

function DetailMission() {
    const [missions, setMissions] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams(); // <-- MISSIE ID UIT URL

    const fetchMissions = async () => {
        try {
            // Als er een ID is → haal 1 missie op
            if (id) {
                const response = await axios.get(`http://localhost:5000/api/missions/${id}`);
                setMissions([response.data]); // in array zetten zodat map() werkt
            } 
            // Anders → haal alle missies op
            else {
                const response = await axios.get('http://localhost:5000/api/missions');
                setMissions(response.data);
            }
        } catch (error) {
            console.error("Fout bij ophalen missies:", error);
        }
    };

    useEffect(() => {
        fetchMissions();
    }, [id]);

    const handleDelete = async (missionId) => {
        try {
            await axios.delete(`http://localhost:5000/api/missions/${missionId}`);
            fetchMissions();
        } catch (error) {
            console.error("Fout bij verwijderen:", error);
        }
    };

    return (
        <main className="detail-outer-form">
            <div className="outer-form-detail">
                <div className="text-container">
                    <h1>Mission History</h1>
                    <button 
                        className="submit" 
                        onClick={() => navigate('/mission')}
                    >
                        Terug naar Planner
                    </button>
                    <button 
                        className="submit" 
                        onClick={() => navigate('/savedmissions')}
                    >
                        view alle saved missions
                    </button>
                </div>

                <section className='detail-mission-outer'>
                    <div className='inner-form-mission-detail'>
                        {missions.length > 0 ? (
                            missions.map((m, index) => (
                                <MissionDetailCard
                                    key={index}
                                    index={index}
                                    label={"Mission#"}
                                    text={m}
                                    onClick={() => handleDelete(m.id)}
                                />
                            ))
                        ) : (
                            <p>Geen missies gevonden in de database.</p>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

export default DetailMission;

