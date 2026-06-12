import { useContext, useEffect } from "react";
import CrewCard from "../components/CrewCard";
import { CrewContext } from "../context/CrewContext";
import styles from './CrewDashBoard.module.css';

function CrewDashboard() {
  const {
    missions,
    acceptMission,
    refreshMissions,
  } = useContext(CrewContext);

  useEffect(() => {
    refreshMissions();
  }, []);

  return (
    <>
      <header>
        <h1>Crew Dashboard</h1>
      </header>

      <main className={styles.crewDashBoard}>
        {(!missions || missions.length === 0) && (
          <p>No missions available 🚀</p>
        )}
        <section className={styles.crewCardContainer}>
          {Array.isArray(missions) &&
            missions
              .filter(Boolean)
              .map((mission, index) => (
                <CrewCard
                  key={mission._id}
                  mission={mission}
                  index={index}
                  onAccept={acceptMission}
                />
              ))}
        </section>
      </main>
      <footer>
        <p>PixelPopping@Productions</p>
      </footer>
    </>
  );
}

export default CrewDashboard;