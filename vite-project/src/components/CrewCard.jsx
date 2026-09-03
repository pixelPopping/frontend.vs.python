import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styles from "./CrewCard.module.css";

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
  // MISSION ID
  // =================================================
  const missionId =
    mission?._id ||
    mission?.id;

  // =================================================
  // DATE FORMATTER
  // =================================================
  function formatDate(date) {
    if (!date) {
      return "Unknown";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown";
    }

    return parsedDate.toLocaleDateString(
      "nl-NL",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  }

  // =================================================
  // DATA
  // =================================================
  const title =
    mission.title ||
    (missionId
      ? `Mission ${String(missionId).slice(-4)}`
      : "Untitled Mission");

  const description =
    mission.description ||
    "No mission briefing available.";

  const captain =
    mission.captain ||
    "Unknown";

  const crewList = Array.isArray(
    mission.crew,
  )
    ? mission.crew
    : [];

  // =================================================
  // CURRENT USER
  // =================================================
  const myCrewMember = crewList.find(
    (member) =>
      member?.name ===
      user?.username,
  );

  const hasAccepted =
    mission.status === "accepted" ||
    myCrewMember?.accepted === true;

  // =================================================
  // MISSION DETAILS
  // =================================================
  const rocket =
    mission.rocket ||
    "Unknown";

  const ship =
    mission.ship ||
    "Unknown";

  const launchPad =
    mission.launchPad ||
    "Unknown";

  const landingPad =
    mission.landingPad ||
    "Unknown";

  const destination =
    mission.city ||
    "Unknown";

  const launchDate =
    formatDate(
      mission.launchDate,
    );

  const returnDate =
    formatDate(
      mission.returnDate,
    );

  // =================================================
  // ACCEPT MISSION
  // =================================================
  function handleAccept() {
    if (!missionId) {
      console.error(
        "Cannot accept mission: no mission ID.",
      );
      return;
    }

    onAccept?.(missionId);
  }

  // =================================================
  // MISSION CONTROL
  // =================================================
  function handleMissionControl() {
    if (!missionId) {
      console.error(
        "Cannot open Mission Control: no mission ID.",
      );
      return;
    }

    localStorage.setItem(
      "activeMissionId",
      String(missionId),
    );

    navigate("/contact");
  }

  // =================================================
  // RENDER
  // =================================================
  return (
    <section
      className={styles.crewCard}
    >
      <article
        className={
          styles.crewCardDetail
        }
      >
        <div
          className={
            styles.cardheader
          }
        >
          <h3
            className={
              styles.titelHeader
            }
          >
            {title}
          </h3>
        </div>

        <p
          className={styles.crewtext}
        >
          {description}
        </p>

        <p
          className={styles.crewtext}
        >
          <strong>
            Launch Date:
          </strong>{" "}
          {launchDate}
        </p>

        <p
          className={styles.crewtext}
        >
          <strong>
            Return Date:
          </strong>{" "}
          {returnDate}
        </p>

        <p
          className={styles.crewtext}
        >
          <strong>Captain:</strong>{" "}
          {captain}
        </p>

        <p
          className={styles.crewtext}
        >
          <strong>Crew:</strong>{" "}
          {crewList.length > 0
            ? crewList
                .map(
                  (member) =>
                    member?.name ||
                    member?.username ||
                    "Unknown",
                )
                .join(" & ")
            : "No crew assigned"}
        </p>

        <p
          className={styles.crewtext}
        >
          <strong>Rocket:</strong>{" "}
          {rocket}
        </p>

        <p
          className={styles.crewtext}
        >
          <strong>Ship:</strong>{" "}
          {ship}
        </p>

        <p
          className={styles.crewtext}
        >
          <strong>
            Launch Pad:
          </strong>{" "}
          {launchPad}
        </p>

        <p
          className={styles.crewtext}
        >
          <strong>
            Landing Pad:
          </strong>{" "}
          {landingPad}
        </p>

        <p
          className={styles.crewtext}
        >
          <strong>
            Destination:
          </strong>{" "}
          {destination}
        </p>

        {/* Accept Mission */}
        {!hasAccepted && (
          <button
            type="button"
            className={
              styles.acceptButton
            }
            onClick={handleAccept}
          >
            Accept Mission 🚀
          </button>
        )}

        {/* Active Mission */}
        {hasAccepted && (
          <div
            className={
              styles.missionactive
            }
          >
            🚀 Mission Active
          </div>
        )}
      </article>

      {/* Mission Control */}
      <div
        className={
          styles.outerbutton
        }
      >
        <section
          className={
            styles.innerbutton
          }
        >
          {hasAccepted && (
            <button
              type="button"
              className={
                styles.controlButton
              }
              onClick={
                handleMissionControl
              }
            >
              Mission Control 🚀
            </button>
          )}
        </section>
      </div>
    </section>
  );
}

export default CrewCard;