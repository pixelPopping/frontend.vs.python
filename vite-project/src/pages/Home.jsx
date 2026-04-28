import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Home.css';
import '../App.css';

function Home() {
    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const navigate = useNavigate();

    const handleNext = () => {
        const start = dateRange[0].toLocaleDateString('nl-NL');
        const end = dateRange[1].toLocaleDateString('nl-NL');

        navigate('/mission', { 
            state: { departure: start, returnDate: end } 
        });
    };

    return (
        <>
        <div className="backgroundimg" aria-hidden="true"></div>
            <div className="header-container">
                <header>
                    <h1 className="unbounded-title">Novi-Naut in Space</h1>
                </header>
            </div>

            <main className="main-outer-form">
                <div className="inner-form">

                    <div className="text-container">
                        <h2>Plan je reis</h2>
                        <p>Selecteer je vertrek- en terugkomstdatum</p>
                    </div>

                    <section className="outer-calender">
                        <section className="inner-calendar">

                            <article className="calendar-wrapper">
                                <Calendar 
                                    onChange={setDateRange} 
                                    value={dateRange} 
                                    selectRange={true} 
                                />
                            </article>

                            <div className="button-container">
                                    <button onClick={handleNext} className="submit">
                                        Volgende
                                    </button>
                            </div>

                        </section>
                    </section>

                </div>
            </main>

            <footer>
                <h2>PixelPopping@Productions</h2>
            </footer>
        </>
    );
}

export default Home;