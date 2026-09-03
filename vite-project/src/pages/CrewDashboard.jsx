import React, { useContext } from "react";
import CrewCard from "../components/CrewCard";
import { CrewContext } from "../context/CrewContext";
import styles from "./CrewDashBoard.module.css";

function CrewDashboard() {
  const {
    missions = [],
    loading = false,
    acceptMission,
  } = useContext(CrewContext);

  return (
    <div className={styles.crewdashboard}>
      <main>
        <header className={styles.crewheader}>
          <h1 className={styles.archivoBlack}>
            Crew Dashboard
          </h1>
        </header>

        {/* Loading */}
        {loading && (
          <p>
            Loading missions...
          </p>
        )}

        {/* No missions */}
        {!loading && missions.length === 0 && (
          <p>
            No missions assigned yet 🚀
          </p>
        )}

        {/* Missions */}
        {!loading && missions.length > 0 && (
          <section>
            {missions.map((mission, index) => (
              <CrewCard
                key={
                  mission?._id ||
                  mission?.id ||
                  `mission-${index}`
                }
                mission={mission}
                onAccept={acceptMission}
              />
            ))}
          </section>
        )}
      </main>

      <footer>
        <p>PixelPopping@productions</p>
      </footer>
    </div>
  );
}

export default CrewDashboard;