import "./CrewCard.css";
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
      <section className="crewCard">
        <article className="crew-card-detail">
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

  const captain =
    mission.captain || "Unknown";

  const crewList = Array.isArray(
    mission.crew
  )
    ? mission.crew
    : [];

  const myCrewMember =
    crewList.find(
      (member) =>
        member.name ===
        user?.firstname
    );

  const hasAccepted =
    myCrewMember?.accepted || false;

  // =================================================
  // DEBUG
  // =================================================
  console.log(
    "================================"
  );

  console.log("FULL USER:", user);

  console.log(
    "CREW LIST:",
    crewList
  );

  console.log(
    "MY CREW MEMBER:",
    myCrewMember
  );

  console.log(
    "HAS ACCEPTED:",
    hasAccepted
  );

  console.log(
    "================================"
  );

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
    <section className="crewCard">
      <article className="crew-card-detail">
        <div className="card-header">
          <h3>{title}</h3>
        </div>

        <p className="crew-text">
          {description}
        </p>

        <p className="crew-text">
          <strong>Launch Date:</strong>{" "}
          {launchDate}
        </p>

        <p className="crew-text">
          <strong>Return Date:</strong>{" "}
          {returnDate}
        </p>

        <p className="crew-text">
          <strong>Captain:</strong>{" "}
          {captain}
        </p>

        <p className="crew-text">
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

        <p className="crew-text">
          <strong>Rocket:</strong>{" "}
          {rocket}
        </p>

        <p className="crew-text">
          <strong>Ship:</strong>{" "}
          {ship}
        </p>

        <p className="crew-text">
          <strong>Launch Pad:</strong>{" "}
          {launchPad}
        </p>

        <p className="crew-text">
          <strong>Landing Pad:</strong>{" "}
          {landingPad}
        </p>

        <p className="crew-text">
          <strong>Destination:</strong>{" "}
          {destination}
        </p>

        {/* ================================================= */}
        {/* ACCEPT BUTTON */}
        {/* ================================================= */}
        {!hasAccepted && (
          <button
            onClick={() =>
              onAccept?.(
                mission._id
              )
            }
          >
            Accept Mission 🚀
          </button>
        )}

        {/* ================================================= */}
        {/* ACCEPTED */}
        {/* ================================================= */}
        {hasAccepted && (
          <>
            <p>
              🚀 You accepted this
              mission
            </p>

            <button
              onClick={() => {
                localStorage.setItem(
                  "activeMissionId",
                  mission._id
                );

                navigate("/contact");
              }}
            >
              Mission Control 🚀
            </button>
          </>
        )}
      </article>
    </section>
  );
}

export default CrewCard;