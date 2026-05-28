import getStrategyFromCity
from "../Helpers/getStrategyFromCity";

import "./MissionDetailCard.css";

function MissionDetailCard({

    mission,

    index,

    onDelete,

    isCaptain,

}) {

    if (!mission) {

        return (

            <article className="mission-card">

                <p>
                    Loading mission...
                </p>

            </article>
        );
    }

    const crewList =

        Array.isArray(
            mission.crew
        )

            ? mission.crew

            : [];

    const captain =

        mission.captain ||

        "Unknown";

    const rocket =

        mission.rocket ||

        "Unknown";

    const ship =

        mission.ship ||

        "Unknown";

    const launchPad =

        mission.launchPad ||

        "Unknown";

    const landingPad =

        mission.landingPad ||

        "Unknown";

    const destination =

        mission.city ||

        "Unknown";

    const strategy =

        getStrategyFromCity(
            destination
        );

    const launchDate =

        mission.launchDate ||

        "Unknown";

    const returnDate =

        mission.returnDate ||

        "Unknown";

    const status =

        mission.status ||

        "pending";

    return (
        <section className="mission-card-inner-container">
        <article className="mission-card">

            <h3>

                Mission {index + 1}

            </h3>

            <div className="card-text">

                <p>

                    <strong>
                        Status:
                    </strong>{" "}

                    {status}

                </p>

                <p>

                    <strong>
                        Launch:
                    </strong>{" "}

                    {launchDate}

                </p>

                <p>

                    <strong>
                        Return:
                    </strong>{" "}

                    {returnDate}

                </p>

                <p>

                    <strong>
                        Captain:
                    </strong>{" "}

                    {captain}

                </p>

                <p>

                    <strong>
                        Crew:
                    </strong>{" "}

                    {crewList.length > 0

                        ? crewList.join(
                            " & "
                        )

                        : "No crew assigned"}

                </p>

                <p>

                    <strong>
                        Rocket:
                    </strong>{" "}

                    {rocket}

                </p>

                <p>

                    <strong>
                        Ship:
                    </strong>{" "}

                    {ship}

                </p>

                <p>

                    <strong>
                        Launch Pad:
                    </strong>{" "}

                    {launchPad}

                </p>

                <p>

                    <strong>
                        Landing Pad:
                    </strong>{" "}

                    {landingPad}

                </p>

                <p>

                    <strong>
                        Destination:
                    </strong>{" "}

                    {destination}

                </p>

                <p>

                    <strong>
                        Strategy:
                    </strong>{" "}

                    {strategy}

                </p>

            </div>

            {isCaptain && (

                <section className="delete-button-container">

                    <button

                        onClick={() =>

                            onDelete?.(
                                mission._id
                            )
                        }

                        className="delete"
                    >

                        Delete

                    </button>

                </section>
            )}

        </article>
        </section>
    );
}

export default MissionDetailCard;