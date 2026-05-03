import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import MissionForm from '../components/MissionForm';
import './Mission.css';

const API = "http://localhost:5000";

const Mission = () => {
    const [options, setOptions] = useState({
        astronauts: [],
        rockets: [],
        launches: [],
        landpads: []
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const travelDates = location.state || {};

    useEffect(() => {
        setError(false);

        axios.get(`${API}/api/mission-options`)
            .then(res => setOptions(res.data))
            .catch(() => setError(true));
    }, []);

    const handleFormSubmit = async (formData) => {
        const payload = {
            ...formData,
            departure: travelDates?.departure || "Niet opgegeven",
            returnDate: travelDates?.returnDate || "Niet opgegeven"
        };

        try {
            setLoading(true);

            const res = await axios.post(`${API}/api/launch`, payload);

            navigate(`/rocketlaunch/${res.data.id}`);

        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="outer-mission">
            <main className="mission-outer-form">

                <MissionForm
                    onSubmit={handleFormSubmit}
                    options={options}
                    loading={loading}
                />

                {loading && <p>Loading...</p>}
                {error && <p>error loading data</p>}

            </main>
        </div>
    );
};

export default Mission;



