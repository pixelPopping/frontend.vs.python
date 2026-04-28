function MissionCard({ id, label, onClick, text }) {
    return (
        <article className="mission-card">

            <h3>🚀 {label}</h3>
            <p><strong>Periode:</strong> {text.departure} tot {text.returnDate}</p>
            <p><strong>Captain:</strong> {text.captain}</p>
            <p><strong>Crew:</strong> {text.crewMember1} & {text.crewMember2}</p>
            <p><strong>Rocket:</strong> {text.rocket}</p>
            <p><strong>Destination:</strong> {text.city}</p>
            <p><strong>Strategy:</strong> {text.marsAction}</p>

            <button onClick={onClick} className="submit">Ok</button>

        </article>
    );
}

export default MissionCard;
