// CaptainDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

import MissionForm from "../components/MissionForm";
import Mission from "../pages/Mission";

const API = "http://localhost:5000";

export default function CaptainDashboard() {

    const [missions, setMissions] = useState([]);
    const [options, setOptions] = useState({});
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const token = localStorage.getItem("token");

    // GET MISSIONS

    const fetchMissions = async () => {

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
    };

    // GET SPACEX OPTIONS

    const fetchOptions = async () => {

        try {

            const res = await axios.get(
                `${API}/api/mission-options`
            );

            setOptions(res.data);

        } catch (err) {

            console.error(err);

        }
    };

    useEffect(() => {

        fetchMissions();
        fetchOptions();

    }, []);

    // CREATE MISSION

    const createMission = async (data) => {

        try {

            setLoading(true);

            const crew = [];

            if (data.crewMember1) {
                crew.push(data.crewMember1);
            }

            if (
                data.crewMember2 &&
                data.crewMember2 !== data.crewMember1
            ) {
                crew.push(data.crewMember2);
            }

            const missionData = {

                title: data.city,

                description: `${data.missionAction} mission`,

                launchDate: new Date().toISOString(),

                captain: data.captain,

                rocket: data.rocket,

                launchpad: data.launchpad,

                landpad: data.landpad,

                astronauts: [
                    data.captain
                ],

                crew
            };

            await axios.post(
                `${API}/api/missions`,
                missionData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setIsSuccess(true);

            fetchMissions();

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

            setTimeout(() => {
                setIsSuccess(false);
            }, 2000);
        }
    };

    return (

        <div>

            <MissionForm
                onSubmit={createMission}
                options={options}
                loading={loading}
                isSuccess={isSuccess}
            />

            <div className="mission-list">

                {missions.map(m => (

                    <Mission
                        key={m._id}
                        mission={m}
                        isCaptain={true}
                    />

                ))}

            </div>

        </div>
    );
}