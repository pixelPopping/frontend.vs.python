
import styles from "./CrewCard.module.css";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function CrewCard({ mission, onAccept }) {
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  // =================================================
  // SAFETY
  // =================================================
  if (!mission) {
    return (
      <section className={styles.crewCard}>
        <article className={styles.crewCardDetail}>
          <p>Loading mission...</p>
        </article>
      </section>
    );
  }

  // =================================================
  // DATE FORMATTER
  // =================================================
  function formatDate(date) {
    if (!date) {
      return "Unknown";
    }

    return new Date(date).toLocaleDateString("nl-NL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // =================================================
  // DATA
  // =================================================
  const title =
    mission.title ||
    `Mission ${mission._id?.slice(-4)}` ||
    "Untitled Mission";

  const description =
    mission.description ||
    "No mission briefing available.";

  const captain = mission.captain || "Unknown";

  const crewList = Array.isArray(mission.crew)
    ? mission.crew
    : [];

  const myCrewMember = crewList.find(
    (member) =>
      member.name === user?.username
  );

  const hasAccepted =
    myCrewMember?.accepted || false;

  const rocket =
    mission.rocket || "Unknown";

  const ship =
    mission.ship || "Unknown";

  const launchPad =
    mission.launchPad || "Unknown";

  const landingPad =
    mission.landingPad || "Unknown";

  const destination =
    mission.city || "Unknown";

  const launchDate = formatDate(
    mission.launchDate
  );

  const returnDate = formatDate(
    mission.returnDate
  );

  // =================================================
  // RENDER
  // =================================================
  return (
    <section className={styles.crewCard}>
      <article className={styles.crewCardDetail}>
        <div className={styles.cardheader}>
          <h3 className={styles.titelHeader}>
            {title}
          </h3>
        </div>

        <p className={styles.crewtext}>
          {description}
        </p>

        <p className={styles.crewtext}>
          <strong>Launch Date:</strong>{" "}
          {launchDate}
        </p>

        <p className={styles.crewtext}>
          <strong>Return Date:</strong>{" "}
          {returnDate}
        </p>

        <p className={styles.crewtext}>
          <strong>Captain:</strong>{" "}
          {captain}
        </p>

        <p className={styles.crewtext}>
          <strong>Crew:</strong>{" "}
          {crewList.length > 0
            ? crewList
                .map(
                  (member) =>
                    member.name
                )
                .join(" & ")
            : "No crew assigned"}
        </p>

        <p className={styles.crewtext}>
          <strong>Rocket:</strong>{" "}
          {rocket}
        </p>

        <p className={styles.crewtext}>
          <strong>Ship:</strong>{" "}
          {ship}
        </p>

        <p className={styles.crewtext}>
          <strong>Launch Pad:</strong>{" "}
          {launchPad}
        </p>

        <p className={styles.crewtext}>
          <strong>Landing Pad:</strong>{" "}
          {landingPad}
        </p>

        <p className={styles.crewtext}>
          <strong>Destination:</strong>{" "}
          {destination}
        </p>

        {!hasAccepted && (
          <button
            className={styles.acceptButton}
            onClick={() =>
              onAccept?.(
                mission._id
              )
            }
          >
            Accept Mission 🚀
          </button>
        )}

        {hasAccepted && (
          <>
            <div
              className={
                styles.missionactive
              }
            >
              🚀 Mission Active
            </div>

            <div
              className={
                styles.buttoncontainer
              }
            >
              <section
                className={
                  styles.missioncontrol
                }
              >
                <button
                  className={
                    styles.controlButton
                  }
                  onClick={() => {
                    localStorage.setItem(
                      "activeMissionId",
                      mission._id
                    );

                    navigate(
                      "/contact"
                    );
                  }}
                >
                  Mission Control 🚀
                </button>
              </section>
            </div>
          </>
        )}
      </article>
    </section>
  );
}

export default CrewCard;

