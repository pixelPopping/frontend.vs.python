import { useEffect, useState } from "react";
import axios from "axios";
import MissionDetailCard from "../components/MissionDetailCard";

const API = "/api";

export default function Mission() {
  const [missions, setMissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [isCaptain, setIsCaptain] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${API}/missions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setMissions(res.data))
      .catch((error) => {
        console.error(
          "Error fetching missions:",
          error.response?.data || error
        );
      });

    axios
      .get(`${API}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUsers(res.data))
      .catch((error) => {
        console.error(
          "Error fetching users:",
          error.response?.data || error
        );
      });

    const role = localStorage.getItem("role");
    setIsCaptain(role === "captain");
  }, []);

  return (
    <main className={styles.missionpage}>
      <h1 className={styles.unbounded}>Missions</h1>

      <section className={styles.missionlist}>
        {missions.map((m) => (
          <MissionDetailCard
            key={m._id}
            mission={m}
            users={users}
            isCaptain={isCaptain}
          />
        ))}
      </section>
    </main>
  );
}