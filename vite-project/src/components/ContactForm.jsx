import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { CrewContext } from "../context/CrewContext";
import { deleteMission } from "../api/missions";

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
        "Are you sure you want to end this mission?"
      );

      if (!confirmed) {
        return;
      }

      await deleteMission(activeMissionId);

      clearActiveMission();

      alert("Mission ended successfully 🚀");

      navigate("/crew-dashboard");
    } catch (error) {
      console.error(
        "END MISSION ERROR:",
        error
      );

      alert(
        "Failed to end mission"
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
          You can return to your
          dashboard to monitor your
          active mission and future
          assignments.
        </p>

        <div className="button-group">
          <button
            type="button"
            onClick={() =>
              navigate(
                "/crew-dashboard"
              )
            }
          >
            Crew Dashboard
          </button>

          <button
            type="button"
            onClick={endMission}
          >
            End Mission 🚀
          </button>
        </div>
      </section>
    </main>
  );
};

export default ContactForm;