import { useContext } from "react";
import CrewCard from "../components/CrewCard";
import { CrewContext } from "../context/CrewContext";

function CrewDashboard() {
  const {
    missions,

    acceptMission,
  } = useContext(CrewContext);

  return (
    <>
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}
      <header>
        <h1>Crew Dashboard</h1>
      </header>

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}
      <main className="crew-dashboard">
        {/* ================================================= */}
        {/* EMPTY */}
        {/* ================================================= */}
        {(!missions || missions.length === 0) && (
          <p>No missions available 🚀</p>
        )}

        {/* ================================================= */}
        {/* MISSION LIST */}
        {/* ================================================= */}
        <section className="crew-card-container">
          {Array.isArray(missions) &&
            missions
              .filter(Boolean)
              .map((mission, index) => (
                <CrewCard
                  key={mission._id}
                  mission={mission}
                  index={index}
                  onAccept={acceptMission}
                />
              ))}
        </section>
      </main>
    </>
  );
}

export default CrewDashboard;