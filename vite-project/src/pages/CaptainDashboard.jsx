import React from "react";
import { useContext } from "react";
import MissionForm from "../components/MissionForm";
import MissionDetailCard from "../components/MissionDetailCard";
import styles from "./CaptainDashBoard.module.css";
import "../App.css";
import { CaptainContext } from "../context/CaptainContext";

function CaptainDashboard() {
  const {
    missions,
    users,
    options,
    loading,
    isSuccess,
    handleCreateMission,
    handleDeleteMission,
  } = useContext(CaptainContext);

  return (
    <div className={styles.dashboard}>
      <div className={styles.headerContainer}>
        <div className={styles.novilogo}></div>
      </div>

      <header className={styles.captainTitle}>
        <h1>Captain Dashboard</h1>
      </header>

      <main className={styles.missionPage}>
        <section className={styles.outerMission}>
          <article className={styles.missionOuterForm}>
            <MissionForm
              onSubmit={handleCreateMission}
              users={users}
              options={options}
              loading={loading}
              isSuccess={isSuccess}
            />
          </article>

          {(!missions || missions.length === 0) && <p>No missions yet 🚀</p>}

          <div className={styles.outerCardList}>
            <div className={styles.missionList}>
              {Array.isArray(missions) &&
                missions
                  .filter(Boolean)
                  .map((mission, index) => (
                    <MissionDetailCard
                      key={mission._id}
                      mission={mission}
                      index={index}
                      onDelete={handleDeleteMission}
                      isCaptain={true}
                    />
                  ))}
            </div>
          </div>
        </section>
      </main>
      <div className={styles.outerFooter}>
        <section className={styles.Footer}>
      <footer className={styles.innerFooter}>
        <p>pixelpopper@productions</p>
      </footer>
       </section>
      </div>
    </div>
  );
}

export default CaptainDashboard;