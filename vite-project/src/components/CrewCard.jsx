import "./CrewCard.css";

function CrewCard({
    mission,
    onAccept,
}) {

    // ---------------- SAFETY ----------------
    if (!mission) {

        return (

            <section className="crewCard">

                <article className="crew-card-detail">

                    <p>Loading mission...</p>

                </article>

            </section>
        );
    }

    // ---------------- DATA ----------------
    const title =
        mission.title ||
        `Mission ${mission._id?.slice(-4)}` ||
        "Untitled Mission";

    const description =
        mission.description ||
        "No mission briefing available.";

    const status =
        mission.status || "pending";

    const captain =
        mission.captain || "Unknown";

    const crewList = Array.isArray(mission.crew)
        ? mission.crew
        : [];

    const rocket =
        mission.rocket?.name ||
        "Unknown";

    const destination =
        mission.city || "Unknown";

    // ---------------- RENDER ----------------
    return (

        <section className="crewCard">

            <article className="crew-card-detail">

                <div className="card-header">

                    <h3>
                        {title}
                    </h3>

                </div>

                <p className="crew-text">

                    {description}

                </p>

                <p className="crew-text">

                    <strong>Status:</strong>{" "}
                    {status}

                </p>

                <p className="crew-text">

                    <strong>Captain:</strong>{" "}
                    {captain}

                </p>

                <p className="crew-text">

                    <strong>Crew:</strong>{" "}
                    {crewList.length > 0
                        ? crewList.join(" & ")
                        : "No crew assigned"}

                </p>

                <p className="crew-text">

                    <strong>Rocket:</strong>{" "}
                    {rocket}

                </p>

                <p className="crew-text">

                    <strong>Destination:</strong>{" "}
                    {destination}

                </p>

                {status !== "accepted" && (

                    <button
                        onClick={() =>
                            onAccept?.(mission._id)
                        }
                    >
                        Accept Mission 🚀
                    </button>

                )}

                {status === "accepted" && (

                    <p>

                        🚀 Mission in progress

                    </p>

                )}

            </article>

        </section>
    );
}

export default CrewCard;