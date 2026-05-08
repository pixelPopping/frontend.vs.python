import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Home.css';
import '../App.css';

import { AuthContext } from '../context/AuthContext';

function Home() {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const navigate = useNavigate();

  const { isAuth, user } = useContext(AuthContext);

  const handleNext = () => {
    const start = dateRange[0].toLocaleDateString('nl-NL');
    const end = dateRange[1].toLocaleDateString('nl-NL');

    
    if (!isAuth) {
      navigate('/signin');
      return;
    }

    
    if (user?.role === "captain") {
      navigate('/captain', {
        state: { departure: start, returnDate: end }
      });
      return;
    }

    
    if (user?.role === "crew") {
      navigate('/crew', {
        state: { departure: start, returnDate: end }
      });
      return;
    }

    
    navigate('/mission', {
      state: { departure: start, returnDate: end }
    });
  };

  return (
    <>
     
      <div className="backgroundimg" aria-hidden="true"></div>

      
      <div className="header-container">
        <div className="novilogo"></div>

        <header>
          <h1 className="unbounded-title">Novi-Naut in Space</h1>
        </header>
      </div>

     
      <div className="outer-layout">
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
                  <button onClick={handleNext} className="submit-next">
                    Volgende
                  </button>
                </div>

              </section>
            </section>

          </div>
        </main>
      </div>

      
      <footer>
        <h2>PixelPopping@Productions</h2>
      </footer>
    </>
  );
}

export default Home;