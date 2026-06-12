import { createContext, useEffect, useState } from "react";

import {
  getMissions,
  createMission,
  deleteMission,
} from "../api/missions";

import { getUsers } from "../api/users";

import { getMissionOptions } from "../api/missionOptions";

export const CaptainContext =
  createContext(null);

function CaptainContextProvider({
  children,
}) {
  const [missions, setMissions] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  const [options, setOptions] =
    useState({});

  const [loading, setLoading] =
    useState(false);

  const [isSuccess, setIsSuccess] =
    useState(false);

  const [error, setError] =
    useState(null);

  useEffect(() => {
    initializeDashboard();
  }, []);

  async function initializeDashboard() {
    try {
      setLoading(true);

      setError(null);

      console.log(
        "================================"
      );

      console.log(
        "LOADING DASHBOARD"
      );

      const [
        missionsData,
        usersData,
        optionsData,
      ] = await Promise.all([
        getMissions(),
        getUsers(),
        getMissionOptions(),
      ]);

      console.log(
        "MISSIONS DATA:"
      );

      console.log(
        missionsData
      );

      console.log(
        "USERS DATA:"
      );

      console.log(
        usersData
      );

      console.log(
        "MISSION OPTIONS DATA:"
      );

      console.log(
        optionsData
      );

      setMissions(
        missionsData || []
      );

      setUsers(
        usersData || []
      );

      setOptions(
        optionsData || {}
      );

      console.log(
        "OPTIONS SAVED"
      );

      console.log(
        optionsData
      );

      console.log(
        "================================"
      );
    } catch (error) {
      console.error(
        "DASHBOARD ERROR:"
      );

      console.error(error);

      console.error(
        error?.response?.data
      );

      setError(
        error.message
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateMission(
    missionData
  ) {
    try {
      setLoading(true);

      setError(null);

      setIsSuccess(false);

      console.log(
        "MISSION PAYLOAD:"
      );

      console.log(
        missionData
      );

      await createMission(
        missionData
      );

      const updatedMissions =
        await getMissions();

      setMissions(
        updatedMissions
      );

      setIsSuccess(true);
    } catch (error) {
      console.error(
        "CREATE ERROR:"
      );

      console.error(error);

      console.error(
        error?.response?.data
      );

      setError(
        error.message
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteMission(
    id
  ) {
    try {
      setLoading(true);

      console.log(
        "DELETE ID:",
        id
      );

      await deleteMission(id);

      const updatedMissions =
        await getMissions();

      setMissions(
        updatedMissions
      );
    } catch (error) {
      console.error(
        "DELETE ERROR:"
      );

      console.error(error);

      console.error(
        error?.response?.data
      );

      setError(
        error.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <CaptainContext.Provider
      value={{
        missions,
        users,
        options,
        loading,
        error,
        isSuccess,
        handleCreateMission,
        handleDeleteMission,
      }}
    >
      {children}
    </CaptainContext.Provider>
  );
}

export default CaptainContextProvider;