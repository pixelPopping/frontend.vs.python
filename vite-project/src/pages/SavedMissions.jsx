import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MissionDetailCard from '../components/MissionDetailCard';
import './DetailMission.css';

const API = "http://localhost:5000";

function SavedMission() {
    const [missions, setMissions] = useState([]);
    const navigate = useNavigate();

    const fetchMissions = async () => {
        try {
            const res = await axios.get(`${API}/api/missions`);
            setMissions(res.data);
        } catch (err) {
            console.error("Fout bij ophalen missies:", err);
        }
    };

    useEffect(() => {
        fetchMissions();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API}/api/missions/${id}`);
            fetchMissions();
        } catch (err) {
            console.error("Delete fout:", err);
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
                </div>

                <section className="detail-mission-outer">
                    <div className="inner-form-mission-detail">

                        {missions.length > 0 ? (
                            missions.map((m) => (
                                <MissionDetailCard
                                    key={m._id}
                                    index={m._id}
                                    label="Mission#"
                                    text={m}
                                    onClick={() => handleDelete(m._id)}
                                />
                            ))
                        ) : (
                            <p>Geen missies gevonden.</p>
                        )}

                    </div>
                </section>

            </div>
        </main>
    );
}

export default SavedMission;
