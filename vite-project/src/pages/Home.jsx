import React, { useState } from 'react';
import Calendar from '../components/Calender';
import 'react-calendar/dist/Calendar.css';

function Home() {
    const [dateRange, setDateRange] = useState([new Date(), new Date()]);

    const handleNext = async () => {
        
        const payload = {
            departure_date: dateRange[0].toISOString().split('T')[0],
            return_date: dateRange[1].toISOString().split('T')[0]
        };

        try {
            await fetch("http://localhost:5000/api/save-dates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            alert("Datums opgeslagen!");
        } catch (error) {
            console.error("Fout bij opslaan:", error);
        }
    };

    return (
        <main>
            <Calendar 
                onChange={setDateRange} 
                value={dateRange} 
                selectRange={true} 
            />
            <button onClick={handleNext} style={{ marginTop: '10px' }}>
                Volgende
            </button>
        </main>
    );
}

export default Home;
