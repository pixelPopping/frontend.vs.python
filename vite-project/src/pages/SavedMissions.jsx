// src/pages/SavedMissions.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DetailMissionCard from '../components/MissionDetailCard';

const API = "http://localhost:5000";

function SavedMissions() {

    const [missions, setMissions] = useState([]);

    useEffect(() => {

        const token = localStorage.getItem("token");

        async function fetchMissions() {

            try {

                const res = await axios.get(
                    `${API}/api/missions`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setMissions(res.data);

            } catch (err) {

                console.error(err);
            }
        }

        fetchMissions();

    }, []);

    return (
        <main className="detail-outer-form">

            <h1>Saved Missions</h1>

            {missions.map((mission, index) => (

                <DetailMissionCard
                    key={mission._id}
                    label="Mission"
                    text={mission}
                    index={index}
                />

            ))}

        </main>
    );
}

export default SavedMissions;