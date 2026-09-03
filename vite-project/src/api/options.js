import client from "./client";

import {
  demoMissionOptions,
} from "../data/demoData";

// =================================================
// GET MISSION OPTIONS
// =================================================

export async function getMissionOptions() {
  try {
    const response =
      await client.get(
        "/mission-options"
      );

    console.log(
      "✅ Mission options loaded from backend"
    );

    return response.data;
  } catch (error) {
    console.warn(
      "⚠️ Backend unavailable."
    );

    console.warn(
      "Using demo mission options."
    );

    return demoMissionOptions;
  }
}