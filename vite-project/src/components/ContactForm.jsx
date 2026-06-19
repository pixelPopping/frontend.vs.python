import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { CrewContext } from "../context/CrewContext";

import styles from "./ContactForm.module.css";

const ContactForm = () => {
  const navigate = useNavigate();

  const {
    activeMissionId,
    clearActiveMission,
  } = useContext(CrewContext);

  async function endMission() {
    try {
      if (!activeMissionId) {
        alert("No active mission found 🚀");
        return;
      }

      const confirmed = window.confirm(
        "Remove this mission from your dashboard?"
      );

      if (!confirmed) {
        return;
      }

      // =====================================
      // REMOVE LOCAL ACTIVE MISSION ONLY
      // =====================================
      clearActiveMission();

      alert(
        "Mission removed from dashboard 🚀"
      );

      navigate("/crew-dashboard");

    } catch (error) {

      console.error(
        "END MISSION ERROR:",
        error
      );

      alert(
        "Failed to remove mission"
      );
    }
  }

  return (
    <div className={styles.outercontainer}>
      <header className={styles.headercontainer}>
        <h1 className={styles.contactTitle}>
          Dear Crewmember,
        </h1>
      </header>

      <main>
        <section className={styles.contentouter}>
          <article className={styles.contentinner}>
      <h2>Your mission has been launched 🚀</h2>
        <p>
          You can return to your dashboard
          to monitor your active mission
          and future assignments.
        </p>
           </article>
        </section>

        
        <div className={styles.buttongroup}>
          <section className={styles.innerbutton}>
          <button className={styles.crewDashboard}
            type="button"
            onClick={() =>
              navigate("/crew-dashboard")
            }
          >
            Dashboard
          </button>

          <button className={styles.remove}
            type="button"
            onClick={endMission}
          >
            Delete
          </button>
          </section>
        </div>
        </main>
    </div>
  );
};

export default ContactForm;