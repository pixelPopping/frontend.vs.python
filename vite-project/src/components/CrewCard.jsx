import "./CrewCard.css";

function CrewCard({
  mission,

  onAccept,
}) {
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
    mission.title || `Mission ${mission._id?.slice(-4)}` || "Untitled Mission";

  const description = mission.description || "No mission briefing available.";

  const status = mission.status || "pending";

  const captain = mission.captain || "Unknown";

  const crewList = Array.isArray(mission.crew) ? mission.crew : [];

  const rocket = mission.rocket || "Unknown";

  const ship = mission.ship || "Unknown";

  const launchPad = mission.launchPad || "Unknown";

  const landingPad = mission.landingPad || "Unknown";

  const destination = mission.city || "Unknown";

  const launchDate = formatDate(mission.launchDate);

  const returnDate = formatDate(mission.returnDate);

  // =================================================
  // RENDER
  // =================================================
  return (
    <section className="crewCard">
      <article className="crew-card-detail">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}
        <div className="card-header">
          <h3>{title}</h3>
        </div>

        {/* ================================================= */}
        {/* DESCRIPTION */}
        {/* ================================================= */}
        <p className="crew-text">{description}</p>

        {/* ================================================= */}
        {/* STATUS */}
        {/* ================================================= */}
        <p className="crew-text">
          <strong>Status:</strong> {status}
        </p>

        {/* ================================================= */}
        {/* DATES */}
        {/* ================================================= */}
        <p className="crew-text">
          <strong>Launch Date:</strong> {launchDate}
        </p>

        <p className="crew-text">
          <strong>Return Date:</strong> {returnDate}
        </p>

        {/* ================================================= */}
        {/* CAPTAIN */}
        {/* ================================================= */}
        <p className="crew-text">
          <strong>Captain:</strong> {captain}
        </p>

        {/* ================================================= */}
        {/* CREW */}
        {/* ================================================= */}
        <p className="crew-text">
          <strong>Crew:</strong>{" "}
          {crewList.length > 0 ? crewList.join(" & ") : "No crew assigned"}
        </p>

        {/* ================================================= */}
        {/* ROCKET */}
        {/* ================================================= */}
        <p className="crew-text">
          <strong>Rocket:</strong> {rocket}
        </p>

        {/* ================================================= */}
        {/* SHIP */}
        {/* ================================================= */}
        <p className="crew-text">
          <strong>Ship:</strong> {ship}
        </p>

        {/* ================================================= */}
        {/* LAUNCHPAD */}
        {/* ================================================= */}
        <p className="crew-text">
          <strong>Launch Pad:</strong> {launchPad}
        </p>

        {/* ================================================= */}
        {/* LANDINGPAD */}
        {/* ================================================= */}
        <p className="crew-text">
          <strong>Landing Pad:</strong> {landingPad}
        </p>

        {/* ================================================= */}
        {/* DESTINATION */}
        {/* ================================================= */}
        <p className="crew-text">
          <strong>Destination:</strong> {destination}
        </p>

        {/* ================================================= */}
        {/* ACCEPT BUTTON */}
        {/* ================================================= */}
        {status !== "accepted" && (
          <button onClick={() => onAccept?.(mission._id)}>
            Accept Mission 🚀
          </button>
        )}

        {/* ================================================= */}
        {/* ACCEPTED */}
        {/* ================================================= */}
        {status === "accepted" && <p>🚀 Mission in progress</p>}
      </article>
    </section>
  );
}

export default CrewCard;
