import getStrategyFromCity from "../Helpers/getStrategyFromCity";

import "./MissionDetailCard.css";

function MissionDetailCard({
    mission,
    index,
    onDelete,
    isCaptain,
}) {

    // ---------------- SAFETY ----------------
    if (!mission) {

        return (

            <article className="mission-card">

                <p>Loading mission...</p>

            </article>
        );
    }

    // ---------------- DATA ----------------
    const crewList = Array.isArray(mission.crew)
        ? mission.crew
        : [];

    const captain =
        mission.captain || "Unknown";

    const rocket =
        mission.rocket?.name ||
        "Unknown";

    const launchPad =
        mission.launchPad?.full_name ||
        mission.launchPad?.name ||
        "Unknown";

    const landingPad =
        mission.landingPad?.full_name ||
        mission.landingPad?.name ||
        "Unknown";

    const destination =
        mission.city || "Unknown";

    const strategy =
        getStrategyFromCity(destination);

    const launchDate =
        mission.launchDate || "Unknown";

    const returnDate =
        mission.returnDate || "Unknown";

    // ---------------- RENDER ----------------
    return (

        <article className="mission-card">

            <h3>
                Mission {index + 1}
            </h3>

            <div className="card-text">

                <p>
                    <strong>Periode:</strong>{" "}
                    {launchDate} t/m {returnDate}
                </p>

                <p>
                    <strong>Captain:</strong>{" "}
                    {captain}
                </p>

                <p>
                    <strong>Crew:</strong>{" "}
                    {crewList.length > 0
                        ? crewList.join(" & ")
                        : "No crew assigned"}
                </p>

                <p>
                    <strong>Rocket:</strong>{" "}
                    {rocket}
                </p>

                <p>
                    <strong>Launch Pad:</strong>{" "}
                    {launchPad}
                </p>

                <p>
                    <strong>Landing Pad:</strong>{" "}
                    {landingPad}
                </p>

                <p>
                    <strong>Destination:</strong>{" "}
                    {destination}
                </p>

                <p>
                    <strong>Strategy:</strong>{" "}
                    {strategy}
                </p>

            </div>

            {isCaptain && (

                <section className="delete-button-container">

                    <button
                        onClick={() =>
                            onDelete?.(mission._id)
                        }
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