import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import MissionDetailCard from "../components/MissionDetailCard";
import { AuthContext } from "../context/AuthContext";
import {
  getMissions,
} from "../api/missions";
import {
  getUsers,
} from "../api/users";


export default function Mission() {
  const {
    user,
  } = useContext(AuthContext);

  const [missions, setMissions] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  // =================================================
  // LOAD MISSIONS + USERS
  // =================================================
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setErrorMessage("");

      try {
        const [
          missionData,
          userData,
        ] = await Promise.all([
          getMissions(),
          getUsers(),
        ]);

        setMissions(
          Array.isArray(missionData)
            ? missionData
            : Array.isArray(
                missionData?.missions,
              )
              ? missionData.missions
              : [],
        );

        setUsers(
          Array.isArray(userData)
            ? userData
            : Array.isArray(
                userData?.users,
              )
              ? userData.users
              : [],
        );
      } catch (error) {
        console.error(
          "Error loading mission data:",
          error,
        );

        setErrorMessage(
          "Could not load missions.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // =================================================
  // ROLE
  // =================================================
  const isCaptain =
    user?.role === "captain";

  // =================================================
  // RENDER
  // =================================================
  return (
    <main
      className={styles.missionpage}
    >
      <h1
        className={styles.unbounded}
      >
        Missions
      </h1>

      {loading && (
        <p>
          Loading missions...
        </p>
      )}

      {errorMessage && (
        <p>
          {errorMessage}
        </p>
      )}

      {!loading &&
        !errorMessage &&
        missions.length === 0 && (
          <p>
            No missions available 🚀
          </p>
        )}

      {!loading &&
        missions.length > 0 && (
          <section
            className={
              styles.missionlist
            }
          >
            {missions.map(
              (mission, index) => (
                <MissionDetailCard
                  key={
                    mission?._id ||
                    mission?.id ||
                    `mission-${index}`
                  }
                  mission={mission}
                  users={users}
                  isCaptain={isCaptain}
                />
              ),
            )}
          </section>
        )}
    </main>
  );
}