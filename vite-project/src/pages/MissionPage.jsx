import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MissionForm from '../components/MissionForm';


const MissionPage = () => {
    const [options, setOptions] = useState({
        astronauts: [],
        rockets: [],
        launches: [],
        landpads: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Axios get-verzoek naar je Flask API
                const response = await axios.get('http://localhost:5000/api/mission-options');
                // Belangrijk: Axios data zit in response.data
                setOptions(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Fout bij het ophalen van missiegegevens:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleFormSubmit = async (formData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/launch', formData);
            alert(response.data.message);
        } catch (error) {
            console.error("Fout bij registreren missie:", error);
            alert("Er is iets misgegaan bij het lanceren.");
        }
    };

    return (
        <div className="page-container">
            <MissionForm 
                onSubmit={handleFormSubmit} 
                options={options} 
                loading={loading} 
            />
        </div>
    );
};

export default MissionPage;

