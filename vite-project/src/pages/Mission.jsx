import CrewManager from "../components/CrewManager";

export default function Mission({ mission, isCaptain }) {
    return (
        <div className="mission-card">
            <h3>{mission.title}</h3>
            <p>{mission.description}</p>
            <p><strong>Launch:</strong> {mission.launchDate}</p>

            {mission.assignedTo ? (
                <p><strong>Assigned to:</strong> {mission.assignedTo}</p>
            ) : (
                <p><em>Not assigned</em></p>
            )}

            {isCaptain && (
                <CrewManager missionId={mission.id} crew={mission.crew} />
            )}
        </div>
    );
}

