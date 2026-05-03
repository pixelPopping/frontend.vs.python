import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import MissionDetailCard from '../components/MissionDetailCard';
import './DetailMission.css';

const API = "http://localhost:5000";

function DetailMission() {
    const { id } = useParams();
    const [missions, setMissions] = useState([]);
    const navigate = useNavigate();

    const fetchMission = async () => {
        try {
            if (id) {
                const res = await axios.get(`${API}/api/missions/${id}`);
                setMissions([res.data]);
            } else {
                const res = await axios.get(`${API}/api/missions`);
                setMissions(res.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchMission();
    }, [id]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API}/api/missions/${id}`);
            fetchMission();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <main className="detail-outer-form">
            <div className="outer-form-detail">

                <div className="text-container">
                    <h1>Mission History</h1>

                    <button onClick={() => navigate('/mission')}>
                        Terug
                    </button>

                    <button onClick={() => navigate('/savedmissions')}>
                        Saved Missions
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

export default DetailMission;

