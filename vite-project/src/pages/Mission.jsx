
// src/pages/Mission.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import MissionForm from '../components/MissionForm';

const API = "http://localhost:5000";

const Mission = () => {

    const [options, setOptions] = useState({
        astronauts: [],
        rockets: [],
        launches: []
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const travelDates = location.state || {};

    useEffect(() => {

        axios.get(`${API}/api/mission-options`)
            .then(res => setOptions(res.data))
            .catch(err => console.error(err));

    }, []);

    const handleFormSubmit = async (formData) => {

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const payload = {
                ...formData,
                departure: travelDates?.departure,
                returnDate: travelDates?.returnDate
            };

            const res = await axios.post(
                `${API}/api/launch`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            navigate(`/rocketlaunch/${res.data.id}`);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);
        }
    };

    return (
        <main>

            <MissionForm
                onSubmit={handleFormSubmit}
                options={options}
                loading={loading}
            />

        </main>
    );
};

export default Mission;
