import getStrategyFromCity from "../Helpers/getStrategyFromCity";
import "./DetailMissionCard.css";

function DetailMissionCard({
    label,
    text,
    index,
    onDelete,
    isCaptain
}) {
    return (
        <article className="mission-card">

            <h3>{label} {index + 1}</h3>

            <div className="card-text">

                <p><strong>Periode:</strong> {text.departure} t/m {text.returnDate}</p>
                <p><strong>Captain:</strong> {text.captain}</p>
                <p><strong>Crew:</strong> {text.crewMember1} & {text.crewMember2}</p>
                <p><strong>Rocket:</strong> {text.rocket}</p>
                <p><strong>Launch Pad:</strong> {text.launchPad}</p>
                <p><strong>Landing Pad:</strong> {text.landingPad}</p>

                <p><strong>Destination:</strong> {text.city}</p>
                <p><strong>Strategy:</strong> {getStrategyFromCity(text.city)}</p>

            </div>

    
            {isCaptain && (
                <section className="delete-button-container">
                    <button
                        onClick={() => onDelete?.(text._id)}
                        className="delete"
                    >
                        Delete
                    </button>
                </section>
            )}

        </article>
    );
}

export default DetailMissionCard;