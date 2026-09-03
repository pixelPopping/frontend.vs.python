import {
  createContext,
  useEffect,
  useState,
} from "react";

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

  const [demoMode, setDemoMode] =
    useState(false);

  // ==========================================
  // INITIALIZE
  // ==========================================

  useEffect(() => {
    initializeDashboard();
  }, []);

  async function initializeDashboard() {
    setLoading(true);
    setError(null);

    try {
      console.log(
        "================================"
      );

      console.log(
        "LOADING CAPTAIN DASHBOARD"
      );

      // ------------------------------------------
      // MISSIONS
      // ------------------------------------------

      let missionsData = [];

      try {
        missionsData =
          await getMissions();

        console.log(
          "✅ Missions loaded"
        );
      } catch (error) {
        console.warn(
          "⚠️ Missions API unavailable",
          error
        );
      }

      // ------------------------------------------
      // USERS
      // ------------------------------------------

      let usersData = [];

      try {
        const response =
          await getUsers();

        usersData =
          Array.isArray(response)
            ? response
            : Array.isArray(
                response?.users
              )
            ? response.users
            : [];

        console.log(
          "✅ Users loaded"
        );
      } catch (error) {
        console.warn(
          "⚠️ Users API unavailable"
        );

        /*
         * Demo users.
         *
         * Deze worden alleen gebruikt
         * wanneer de Python backend offline is.
         */

        usersData = [
          {
            id: "demo-crew-1",
            username: "Demo Crew 1",
            role: "crew",
          },
          {
            id: "demo-crew-2",
            username: "Demo Crew 2",
            role: "crew",
          },
        ];
      }

      // ------------------------------------------
      // MISSION OPTIONS
      // ------------------------------------------

      let optionsData = {};

      try {
        optionsData =
          await getMissionOptions();

        console.log(
          "✅ Mission options loaded"
        );
      } catch (error) {
        console.warn(
          "⚠️ Mission options unavailable"
        );
      }

      // ------------------------------------------
      // SAFE DATA
      // ------------------------------------------

      const safeMissions =
        Array.isArray(
          missionsData
        )
          ? missionsData
          : [];

      const safeUsers =
        Array.isArray(
          usersData
        )
          ? usersData
          : [];

      const safeOptions =
        optionsData &&
        typeof optionsData ===
          "object"
          ? optionsData
          : {};

      setMissions(
        safeMissions
      );

      setUsers(
        safeUsers
      );

      setOptions(
        safeOptions
      );

      /*
       * We bepalen demo mode op basis
       * van de beschikbare data.
       */

      const hasDemoMission =
        safeMissions.some(
          (mission) =>
            String(
              mission?._id ??
                mission?.id ??
                ""
            ).startsWith(
              "demo-"
            )
        );

      setDemoMode(
        hasDemoMission
      );

      console.log(
        "MISSIONS:",
        safeMissions
      );

      console.log(
        "USERS:",
        safeUsers
      );

      console.log(
        "OPTIONS:",
        safeOptions
      );

      console.log(
        "DEMO MODE:",
        hasDemoMission
      );

      console.log(
        "================================"
      );
    } catch (error) {
      console.error(
        "CAPTAIN DASHBOARD ERROR:",
        error
      );

      setError(
        "Dashboard kon niet worden geladen."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // CREATE MISSION
  // ==========================================

  async function handleCreateMission(
    missionData
  ) {
    setLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      console.log(
        "MISSION PAYLOAD:",
        missionData
      );

      const createdMission =
        await createMission(
          missionData
        );

      /*
       * createMission() gebruikt automatisch
       * backend óf localStorage.
       */

      console.log(
        "MISSION CREATED:",
        createdMission
      );

      const updatedMissions =
        await getMissions();

      const safeMissions =
        Array.isArray(
          updatedMissions
        )
          ? updatedMissions
          : [];

      setMissions(
        safeMissions
      );

      const isDemo =
        safeMissions.some(
          (mission) =>
            String(
              mission?._id ??
                mission?.id ??
                ""
            ).startsWith(
              "demo-"
            )
        );

      setDemoMode(
        isDemo
      );

      setIsSuccess(true);

      /*
       * Success message weer verwijderen
       * na korte tijd.
       */

      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error(
        "CREATE ERROR:",
        error
      );

      setError(
        "Mission kon niet worden aangemaakt."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // DELETE MISSION
  // ==========================================

  async function handleDeleteMission(
    id
  ) {
    setLoading(true);
    setError(null);

    try {
      console.log(
        "DELETE ID:",
        id
      );

      await deleteMission(id);

      /*
       * Haal opnieuw op.
       *
       * Backend online:
       *     MongoDB
       *
       * Backend offline:
       *     localStorage
       */

      const updatedMissions =
        await getMissions();

      const safeMissions =
        Array.isArray(
          updatedMissions
        )
          ? updatedMissions
          : [];

      setMissions(
        safeMissions
      );

      const isDemo =
        safeMissions.some(
          (mission) =>
            String(
              mission?._id ??
                mission?.id ??
                ""
            ).startsWith(
              "demo-"
            )
        );

      setDemoMode(
        isDemo
      );
    } catch (error) {
      console.error(
        "DELETE ERROR:",
        error
      );

      setError(
        "Mission kon niet worden verwijderd."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // CONTEXT
  // ==========================================

  return (
    <CaptainContext.Provider
      value={{
        missions,
        users,
        options,

        loading,

        error,

        isSuccess,

        demoMode,

        handleCreateMission,

        handleDeleteMission,

        initializeDashboard,
      }}
    >
      {children}
    </CaptainContext.Provider>
  );
}

export default CaptainContextProvider;