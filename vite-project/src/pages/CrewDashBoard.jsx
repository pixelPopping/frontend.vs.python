import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CrewCard from "../components/CrewCard";
import { CrewContext } from "../context/CrewContext";
import styles from "./CrewDashBoard.module.css";

function CrewDashboard() {

     const { missions, loading, acceptMission} = useContext(CrewContext);

    // ---------------- UI ----------------
    return (
        <div className={styles.crewdashboard}>
        <main>
           <header className={styles.crewheader}>
            <h1 className={styles.archivoBlack}>
                Crew Dashboard
            </h1>
            </header>

            {loading && (

                <p>
                    Loading missions...
                </p>

            )}

            {/* ---------------- EMPTY ---------------- */}

            {!loading &&
                missions.length === 0 && (

                <p>
                    No missions assigned yet 🚀
                </p>

            )}

            {/* ---------------- MISSIONS ---------------- */}

            {!loading &&
                missions.length > 0 && (

                missions.map((mission) => (

                    <CrewCard

                        key={mission._id}

                        mission={mission}

                        onAccept={acceptMission}
                    />

                ))
            )}

        </main>
        <footer>
            <p>PixelPopping@productions</p>
        </footer>
        </div>
    );
}

export default CrewDashboard;