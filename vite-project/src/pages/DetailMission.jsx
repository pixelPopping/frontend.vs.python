import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import MissionDetailCard from "../components/MissionDetailCard";
import styles from "./DetailMission.module.css";

const API = "http://localhost:5000";

function DetailMission() {
  const { id } = useParams();
  const [missions, setMissions] = useState([]);
  const navigate = useNavigate();

  const fetchMission = async () => {
    try {
      if (id) {
        const response = await axios.get(`${API}/api/missions/${id}`);
        setMissions([response.data]);
      } else {
        const response = await axios.get(`${API}/api/missions`);
        setMissions(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMission();
  }, [id]);

  const handleDelete = async (missionId) => {
    try {
      await axios.delete(`${API}/api/missions/${missionId}`);
      fetchMission();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className={styles["detail-outer-form"]}>
      <div className={styles["outer-form-detail"]}>
        <div className={styles.textcontainer}>
          <header>
            <h1>Mission Details</h1>
          </header>

          <button onClick={() => navigate("/mission")}>
            Terug
          </button>

          <button onClick={() => navigate("/savedmissions")}>
            Saved Missions
          </button>
        </div>

        <section className={styles["detail-mission-outer"]}>
          <div className={styles["inner-form-mission-detail"]}>
            {missions.length > 0 ? (
              missions.map((mission) => (
                <MissionDetailCard
                  key={mission._id}
                  index={mission._id}
                  label="Mission#"
                  text={mission}
                  onClick={() => handleDelete(mission._id)}
                />
              ))
            ) : (
              <p>No mission found</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default DetailMission;