import React, {
  createContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  getMissions,
  acceptMission,
} from "../api/missions";

export const CrewContext = createContext(null);

function CrewContextProvider({ children }) {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [demoMode, setDemoMode] = useState(false);

  const navigate = useNavigate();

  // =================================================
  // LOAD MISSIONS
  // =================================================
  useEffect(() => {
    loadMissions();
  }, []);

  async function loadMissions() {
    try {
      setLoading(true);
      setError(null);

      const data = await getMissions();

      const missionList = Array.isArray(data)
        ? data
        : Array.isArray(data?.missions)
          ? data.missions
          : [];

      setMissions(missionList);

      // Controleer of we demo-data gebruiken
      const usingDemoData = missionList.some(
        (mission) =>
          String(
            mission?._id || mission?.id || "",
          ).startsWith("demo-"),
      );

      setDemoMode(usingDemoData);
    } catch (error) {
      console.error(
        "MISSIONS ERROR:",
        error,
      );

      setMissions([]);
      setError(
        error?.message ||
          "Could not load missions.",
      );
    } finally {
      setLoading(false);
    }
  }

  // =================================================
  // ACCEPT MISSION
  // =================================================
  async function handleAcceptMission(id) {
    try {
      setLoading(true);
      setError(null);

      await acceptMission(id);

      localStorage.setItem(
        "activeMissionId",
        String(id),
      );

      await loadMissions();

      navigate(`/rocketlaunch/${id}`);
    } catch (error) {
      console.error(
        "ACCEPT ERROR:",
        error,
      );

      setError(
        error?.message ||
          "Could not accept mission.",
      );

      setLoading(false);
    }
  }

  // =================================================
  // ACTIVE MISSION
  // =================================================
  function getActiveMissionId() {
    return localStorage.getItem(
      "activeMissionId",
    );
  }

  function clearActiveMission() {
    localStorage.removeItem(
      "activeMissionId",
    );
  }

  function isMissionActive(id) {
    return (
      getActiveMissionId() ===
      String(id)
    );
  }

  // =================================================
  // PROVIDER
  // =================================================
  return (
    <CrewContext.Provider
      value={{
        missions,
        loading,
        error,
        demoMode,

        refreshMissions:
          loadMissions,

        acceptMission:
          handleAcceptMission,

        activeMissionId:
          getActiveMissionId(),

        isMissionActive,

        clearActiveMission,
      }}
    >
      {children}
    </CrewContext.Provider>
  );
}

export default CrewContextProvider;