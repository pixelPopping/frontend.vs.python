import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { CrewContext } from "../context/CrewContext";

import "./ContactForm.css";

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
    <main className="contact-container">
      <header>
        <h1 className="contact-title">
          Dear Crewmember,
          <br />
          Your mission has been launched 🚀
        </h1>
      </header>

      <section className="contact-content">
        <p>
          You can return to your dashboard
          to monitor your active mission
          and future assignments.
        </p>

        <div className="button-group">
          <button
            type="button"
            onClick={() =>
              navigate("/crew-dashboard")
            }
          >
            Crew Dashboard
          </button>

          <button
            type="button"
            onClick={endMission}
          >
            Remove From Dashboard 🚀
          </button>
        </div>
      </section>
    </main>
  );
};

export default ContactForm;