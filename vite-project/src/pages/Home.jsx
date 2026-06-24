import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './Home.module.css';
import '../App.css';

function Home() {
 
  return (
    <>
      <div className={styles.backgroundimg} aria-hidden="true"></div>
      <div className={styles.headerContainer}>
        <div className={styles.novilogo}></div>

        <header>
          <h1 className={styles.unboundedTitle}>Novi-Naut in Space</h1>
        </header>
      </div>
      
      <div className={styles.outerLayout}>
        <main className={styles.mainOuterForm}>
          <div className={styles.innerForm}>
            
            <div className={styles.content}>
            <section className={styles.textContainer}>
              <h2 className={styles.headercolor}>Welcom to NoviNaut</h2>
              <p className={styles.headercolor}>Name Your captain choose your crew Your journey and Space adventure.</p>
              <p className={styles.headercolor}>Register and Login to start</p>
            </section>
            </div>
          </div>
        </main>
      </div>
      <footer>
        <p>PixelPopping@Productions</p>
      </footer>
    </>
  );
}

export default Home;