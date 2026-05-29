import { useContext } from "react";

import MissionForm from "../components/MissionForm";
import MissionDetailCard from "../components/MissionDetailCard";

import { CaptainContext } from "../context/CaptainContext";

import "./CaptainDashBoard.css";

function CaptainDashboard() {
  const {
    missions,

    users,

    options,

    loading,

    isSuccess,

    handleCreateMission,

    handleDeleteMission,
  } = useContext(CaptainContext);

  return (
    <div className="dashboard">
      <div className="header-container">
        <div className="novilogo"></div>

        <header>
          <h1 className="unbounded-title">Novi-Naut in Space</h1>
        </header>
      </div>
      <main className="mission-page">
        <section className="outer-mission">
          <article className="mission-outer-form">
            <MissionForm
              onSubmit={handleCreateMission}
              users={users}
              options={options}
              loading={loading}
              isSuccess={isSuccess}
            />
          </article>

          {(!missions || missions.length === 0) && <p>No missions yet 🚀</p>}

          <div className="mission-list">
            {Array.isArray(missions) &&
              missions
                .filter(Boolean)
                .map((mission, index) => (
                  <MissionDetailCard
                    key={mission._id}
                    mission={mission}
                    index={index}
                    onDelete={handleDeleteMission}
                    isCaptain={true}
                  />
                ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default CaptainDashboard;
