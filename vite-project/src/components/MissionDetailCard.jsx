import getStrategyFromCity from "../Helpers/getStrategyFromCity";

function DetailMissionCard({ label, text, index, onClick }) {
    return (
        <article className="mission-card">

            <h3>{label} {index + 1}</h3>

            <p><strong>Periode:</strong> {text.departure} t/m {text.returnDate}</p>
            <p><strong>Captain:</strong> {text.captain}</p>
            <p><strong>Crew:</strong> {text.crewMember1} & {text.crewMember2}</p>
            <p><strong>Rocket:</strong> {text.rocket}</p>
            <p><strong>Launch Pad:</strong> {text.launchPad}</p>
            <p><strong>Landing Pad:</strong> {text.landingPad}</p>

            <p><strong>Destination:</strong> {text.city}</p>
            <p><strong>Strategy:</strong> {getStrategyFromCity(text.city)}</p>

            <button 
                onClick={onClick} 
                type="delete"
                className="delete"
            >
                Delete
            </button>

        </article>
    );
}

export default DetailMissionCard;
