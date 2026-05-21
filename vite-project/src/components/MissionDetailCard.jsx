import getStrategyFromCity from "../Helpers/getStrategyFromCity";
import "./MissionDetailCard.css";

function MissionDetailCard({
    mission,
    index,
    onDelete,
    isCaptain
}) {

    if (!mission) {
        return (
            <article className="mission-card">
                <p>Loading mission...</p>
            </article>
        );
    }

    const crewList = Array.isArray(mission?.crew)
        ? mission.crew
        : [];

    return (
        <article className="mission-card">

            <h3>Mission {index + 1}</h3>

            <div className="card-text">

                <p>
                    <strong>Periode:</strong>{" "}
                    {mission?.launchDate} t/m {mission?.returnDate}
                </p>

                <p>
                    <strong>Captain:</strong>{" "}
                    {mission?.captain || "Unknown"}
                </p>

                <p>
                    <strong>Crew:</strong>{" "}
                    {crewList.length > 0
                        ? crewList.join(" & ")
                        : "No crew assigned"}
                </p>

              
                <p>
                    <strong>Rocket:</strong>{" "}
                    {mission?.rocket?.name || mission?.rocket || "Unknown"}
                </p>

                
                <p>
                    <strong>Launch Pad:</strong>{" "}
                    {mission?.launchPad?.full_name ||
                     mission?.launchPad?.name ||
                     mission?.launchPad ||
                     "Unknown"}
                </p>

               
                <p>
                    <strong>Landing Pad:</strong>{" "}
                    {mission?.landingPad?.full_name ||
                     mission?.landingPad?.name ||
                     mission?.landingPad ||
                     "Unknown"}
                </p>

                <p>
                    <strong>Destination:</strong>{" "}
                    {mission?.city}
                </p>

                <p>
                    <strong>Strategy:</strong>{" "}
                    {getStrategyFromCity(mission?.city)}
                </p>

            </div>

            {isCaptain && (
                <section className="delete-button-container">
                    <button
                        onClick={() => onDelete?.(mission?._id)}
                        className="delete"
                    >
                        Delete
                    </button>
                </section>
            )}

        </article>
    );
}

export default MissionDetailCard;