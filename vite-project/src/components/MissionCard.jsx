function MissionCard({ id, label, text, isCaptain, onDelete, onEdit }) {
    return (
        <div className="mission-card">

            <h3>{label}</h3>

            <p>{text.departure} → {text.returnDate}</p>
            <p>Rocket: {text.rocket}</p>
            <p>Destination: {text.city}</p>

            <p>Crew:</p>
            {text.crew?.map((c) => (
                <p key={c}>👨‍🚀 {c}</p>
            ))}

            {isCaptain && (
                <div>
                    <button onClick={() => onEdit?.(id)}>Edit</button>
                    <button onClick={() => onDelete?.(id)}>Delete</button>
                </div>
            )}

        </div>
    );
}

export default MissionCard;