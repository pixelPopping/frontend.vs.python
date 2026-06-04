import React, { createContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { getMissions, acceptMission } from "../api/missions";

export const CrewContext = createContext(null);

function CrewContextProvider({ children }) {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadMissions();
  }, []);

  async function loadMissions() {
    try {
      setLoading(true);
      setError(null);

      const data = await getMissions();

      setMissions(data || []);
    } catch (error) {
      console.error("MISSIONS ERROR:", error);

      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAcceptMission(id) {
    try {
      setLoading(true);
      setError(null);

      await acceptMission(id);

      // ==========================================
      // SAVE ACTIVE MISSION
      // ==========================================
      localStorage.setItem("activeMissionId", id);

      await loadMissions();

      navigate(`/rocketlaunch/${id}`);
    } catch (error) {
      console.error("ACCEPT ERROR:", error);

      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function getActiveMissionId() {
    return localStorage.getItem("activeMissionId");
  }

  function clearActiveMission() {
    localStorage.removeItem("activeMissionId");
  }

  return (
    <CrewContext.Provider
      value={{
        missions,
        loading,
        error,

        refreshMissions: loadMissions,

        acceptMission: handleAcceptMission,

        activeMissionId: getActiveMissionId(),

        clearActiveMission,
      }}
    >
      {children}
    </CrewContext.Provider>
  );
}

export default CrewContextProvider;
