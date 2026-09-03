import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MissionDetailCard from "../components/MissionDetailCard";
import styles from "./DetailMission.module.css";

import {
  getMissions,
  deleteMission,
} from "../api/missions";

function DetailMission() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // =================================================
  // FETCH MISSIONS
  // =================================================
  async function fetchMission() {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getMissions();

      const missionList = Array.isArray(data)
        ? data
        : Array.isArray(data?.missions)
          ? data.missions
          : [];

      if (id) {
        const selectedMission = missionList.find(
          (mission) =>
            String(
              mission?._id || mission?.id,
            ) === String(id),
        );

        setMissions(
          selectedMission
            ? [selectedMission]
            : [],
        );
      } else {
        setMissions(missionList);
      }
    } catch (error) {
      console.error(
        "Error fetching missions:",
        error,
      );

      setMissions([]);
      setErrorMessage(
        "Could not load missions.",
      );
    } finally {
      setLoading(false);
    }
  }

  // =================================================
  // LOAD ON PAGE OPEN
  // =================================================
  useEffect(() => {
    fetchMission();
  }, [id]);

  // =================================================
  // DELETE MISSION
  // =================================================
  async function handleDelete(missionId) {
    if (!missionId) {
      return;
    }

    try {
      setErrorMessage("");

      await deleteMission(missionId);

      await fetchMission();
    } catch (error) {
      console.error(
        "Error deleting mission:",
        error,
      );

      setErrorMessage(
        "Could not delete mission.",
      );
    }
  }

  // =================================================
  // RENDER
  // =================================================
  return (
    <main
      className={
        styles["detail-outer-form"]
      }
    >
      <div
        className={
          styles["outer-form-detail"]
        }
      >
        <div
          className={
            styles.textcontainer
          }
        >
          <header>
            <h1>
              Mission Details
            </h1>
          </header>

          <button
            type="button"
            onClick={() =>
              navigate("/mission")
            }
          >
            Terug
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/savedmissions")
            }
          >
            Saved Missions
          </button>
        </div>

        <section
          className={
            styles[
              "detail-mission-outer"
            ]
          }
        >
          <div
            className={
              styles[
                "inner-form-mission-detail"
              ]
            }
          >
            {loading && (
              <p>
                Loading mission...
              </p>
            )}

            {!loading &&
              errorMessage && (
                <p>
                  {errorMessage}
                </p>
              )}

            {!loading &&
              !errorMessage &&
              missions.length === 0 && (
                <p>
                  No mission found
                </p>
              )}

            {!loading &&
              missions.length > 0 &&
              missions.map(
                (mission, index) => {
                  const missionId =
                    mission?._id ||
                    mission?.id ||
                    `mission-${index}`;

                  return (
                    <MissionDetailCard
                      key={missionId}
                      index={missionId}
                      label="Mission#"
                      text={mission}
                      onClick={() =>
                        handleDelete(
                          missionId,
                        )
                      }
                    />
                  );
                },
              )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default DetailMission;