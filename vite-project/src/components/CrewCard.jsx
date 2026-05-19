 import './CrewCard.css';
 
 function CrewCard({
    mission,
    onAccept
}) {

    return (
       <section className="crewCard">
        <article className="crew-card-detail">
           <div className="card-header">
            <h3>
                {mission.title}
            </h3>
            </div>
            <p className="crew-text">
                {mission.description}
            </p>

            <p className="crew-text" >
                Status: {mission.status || "pending"}
            </p>
            {mission.status !== "accepted" && (

                <button
                    onClick={() =>
                        onAccept(mission._id)
                    }
                >
                    Accept Mission 🚀
                </button>

            )}

            {mission.status === "accepted" && (

                <p>
                    🚀 Mission in progress
                </p>

            )}

        </article>
        </section>
    );
}

export default CrewCard;