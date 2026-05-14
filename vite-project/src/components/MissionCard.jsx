import CrewManager from "./CrewManager";

export default function MissionCard({ mission, users = [], isCaptain }) {

    // Vind toegewezen crewlid (assignedTo)
    const assignedCrew = users.find(u => u.id === mission.assignedTo);

    // Vind alle crewleden in de missie (mission.crew = array van userId's)
    const crewList = mission.crew?.map(id => {
        return users.find(u => u.id === id) || { id, firstname: "Unknown", lastname: "" };
    });

    return (
        <div className="mission-card">
            <header className="mission-header">
                <h2>{mission.title}</h2>
                <p className="mission-date">🚀 {mission.launchDate}</p>
            </header>

            <p className="mission-description">{mission.description}</p>

            {/* AssignedTo */}
            <div className="mission-section">
                <strong>Assigned To:</strong>{" "}
                {assignedCrew
                    ? `${assignedCrew.firstname} ${assignedCrew.lastname}`
                    : <em>No one assigned</em>}
            </div>

            {/* Crew list */}
            <div className="mission-section">
                <strong>Crew:</strong>
                {crewList && crewList.length > 0 ? (
                    <ul className="crew-list">
                        {crewList.map(c => (
                            <li key={c.id}>
                                👨‍🚀 {c.firstname} {c.lastname}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p><em>No crew added yet</em></p>
                )}
            </div>

            {/* Captain controls */}
            {isCaptain && (
                <div className="mission-section">
                    <CrewManager missionId={mission.id} crew={mission.crew} />
                </div>
            )}
        </div>
    );
}
