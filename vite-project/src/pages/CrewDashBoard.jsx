import { useContext, useEffect } from "react";
import CrewCard from "../components/CrewCard";
import { CrewContext } from "../context/CrewContext";

function CrewDashboard() {
  const {
    missions,
    acceptMission,
    refreshMissions,
  } = useContext(CrewContext);

  useEffect(() => {
    refreshMissions();
  }, []);

  return (
    <>
      <header>
        <h1>Crew Dashboard</h1>
      </header>

      <main className="crew-dashboard">
        {(!missions || missions.length === 0) && (
          <p>No missions available 🚀</p>
        )}

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