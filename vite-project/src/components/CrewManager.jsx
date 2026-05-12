import axios from "axios";
import { useEffect, useState } from "react";

const API = "http://localhost:5000";

function CrewManager({ missionId, crew }) {
    const token = localStorage.getItem("token");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get(`${API}/api/users?role=crew`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setUsers(res.data))
        .catch(err => console.error(err));
    }, []);

    const addCrew = async (userId) => {
        await axios.put(
            `${API}/api/missions/${missionId}/crew`,
            { userId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    };

    const removeCrew = async (userId) => {
        await axios.delete(
            `${API}/api/missions/${missionId}/crew`,
            {
                data: { userId },
                headers: { Authorization: `Bearer ${token}` }
            }
        );
    };

    return (
        <div className="crew-box">
            <h4>Crew</h4>

            {crew?.map((id) => {
                const member = users.find(u => u.id === id);
                return (
                    <div key={id}>
                        <p>👨‍🚀 {member ? `${member.firstname} ${member.lastname}` : id}</p>
                        <button onClick={() => removeCrew(id)}>Remove</button>
                    </div>
                );
            })}

            <h5>Add Crew Member</h5>
            {users.map(u => (
                <button key={u.id} onClick={() => addCrew(u.id)}>
                    + {u.firstname} {u.lastname}
                </button>
            ))}
        </div>
    );
}

export default CrewManager;
