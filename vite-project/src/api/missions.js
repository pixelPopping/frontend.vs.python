import client from "./client";

import {
  demoMissions,
} from "../data/demoData";

// =================================================
// DEMO STORAGE
// =================================================

const DEMO_MISSIONS_KEY =
  "novinaut_demo_missions";

function getDemoMissions() {
  try {
    const stored =
      localStorage.getItem(
        DEMO_MISSIONS_KEY,
      );

    if (stored) {
      return JSON.parse(stored);
    }

    localStorage.setItem(
      DEMO_MISSIONS_KEY,
      JSON.stringify(demoMissions),
    );

    return demoMissions;
  } catch (error) {
    console.error(
      "Demo missions konden niet worden geladen:",
      error,
    );

    return demoMissions;
  }
}

function saveDemoMissions(
  missions,
) {
  localStorage.setItem(
    DEMO_MISSIONS_KEY,
    JSON.stringify(missions),
  );
}

// =================================================
// GET MISSIONS
// =================================================

export async function getMissions() {
  try {
    const response =
      await client.get(
        "/missions",
      );

    console.log(
      "✅ Missions loaded from backend",
    );

    return response.data;
  } catch (error) {
    console.warn(
      "⚠️ Backend unavailable.",
    );

    console.warn(
      "Using demo missions.",
    );

    return getDemoMissions();
  }
}

// =================================================
// CREATE MISSION
// =================================================

export async function createMission(
  missionData,
) {
  try {
    const response =
      await client.post(
        "/missions",
        missionData,
      );

    console.log(
      "✅ Mission created through backend",
    );

    return response.data;
  } catch (error) {
    console.warn(
      "⚠️ Backend unavailable.",
    );

    console.warn(
      "Creating demo mission.",
    );

    const missions =
      getDemoMissions();

    const newMission = {
      ...missionData,

      _id:
        `demo-${Date.now()}`,

      id:
        `demo-${Date.now()}`,

      status:
        missionData.status ||
        "pending",

      crew:
        missionData.crew || [],
    };

    const updatedMissions = [
      ...missions,
      newMission,
    ];

    saveDemoMissions(
      updatedMissions,
    );

    return newMission;
  }
}

// =================================================
// DELETE MISSION
// =================================================

export async function deleteMission(
  id,
) {
  try {
    const response =
      await client.delete(
        `/missions/${id}`,
      );

    console.log(
      "✅ Mission deleted from backend",
    );

    return response.data;
  } catch (error) {
    console.warn(
      "⚠️ Backend unavailable.",
    );

    console.warn(
      "Deleting demo mission.",
    );

    const missions =
      getDemoMissions();

    const updatedMissions =
      missions.filter(
        (mission) =>
          String(
            mission._id ??
              mission.id,
          ) !== String(id),
      );

    saveDemoMissions(
      updatedMissions,
    );

    return {
      success: true,
      demoMode: true,
    };
  }
}

// =================================================
// ACCEPT MISSION
// =================================================

export async function acceptMission(
  id,
) {
  try {
    const response =
      await client.put(
        `/missions/${id}/accept`,
      );

    console.log(
      "✅ Mission accepted through backend",
    );

    return response.data;
  } catch (error) {
    console.warn(
      "⚠️ Backend unavailable.",
    );

    console.warn(
      "Accepting demo mission.",
    );

    const missions =
      getDemoMissions();

    const updatedMissions =
      missions.map(
        (mission) => {
          const missionId =
            mission._id ??
            mission.id;

          if (
            String(
              missionId,
            ) !== String(id)
          ) {
            return mission;
          }

          return {
            ...mission,
            status: "accepted",
          };
        },
      );

    saveDemoMissions(
      updatedMissions,
    );

    const acceptedMission =
      updatedMissions.find(
        (mission) => {
          const missionId =
            mission._id ??
            mission.id;

          return (
            String(
              missionId,
            ) === String(id)
          );
        },
      );

    return (
      acceptedMission || {
        success: true,
        demoMode: true,
      }
    );
  }
}