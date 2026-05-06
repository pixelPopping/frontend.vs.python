import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MissionDetailCard from '../components/MissionDetailCard';
import { AuthContext } from '../context/AuthContext';
import './DetailMission.css';

const API = "http://localhost:5000";

function SavedMission() {
    const [missions, setMissions] = useState([]);
    const navigate = useNavigate();

    const { user } = useContext(AuthContext);

    const token = localStorage.getItem("token");

    const fetchMissions = async () => {
        try {
            const res = await axios.get(`${API}/api/missions`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

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
            await axios.delete(`${API}/api/missions/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            fetchMissions();

        } catch (err) {
            console.error("Delete fout:", err);
        }
    };

    const isCaptain = user?.role === "captain";

    return (
        <main className="detail-outer-form">
            <div className="outer-form-detail">

                <div className="text-container">
                    <h1>Mission History</h1>

                    <button
                        className="submit"
                        onClick={() => navigate('/mission')}
                    >
                        Back to Planner
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
                                    
                                    // 👇 delete alleen voor captain
                                    onClick={isCaptain ? () => handleDelete(m._id) : null}
                                />
                            ))
                        ) : (
                            <p>No missions found.</p>
                        )}

                    </div>
                </section>

            </div>
        </main>
    );
}

export default SavedMission;