import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function Home() {
    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const navigate = useNavigate();

    const handleNext = () => {
        // Formatteer datums naar leesbare tekst
        const start = dateRange[0].toLocaleDateString('nl-NL');
        const end = dateRange[1].toLocaleDateString('nl-NL');

        // Navigeer naar de planner en geef de datums mee
        navigate('/mission', { 
            state: { departure: start, returnDate: end } 
        });
    };

    return (
        <main className="main-outer-form">
            <div className="outer-form" style={{ padding: '40px', alignItems: 'center' }}>
                <div className="text-container">
                    <h1>Plan je reis</h1>
                    <p>Selecteer je vertrek- en terugkomstdatum</p>
                </div>
                <Calendar 
                    onChange={setDateRange} 
                    value={dateRange} 
                    selectRange={true} 
                />
                <div className="submit-container" style={{ marginTop: '20px' }}>
                    <button onClick={handleNext} className="submit">Volgende</button>
                </div>
            </div>
        </main>
    );
}

export default Home;
