import client from "./client";

// =================================================
// GET MISSIONS
// =================================================
export async function getMissions() {
  const response = await client.get("/missions");

  return response.data;
}

// =================================================
// CREATE MISSION
// =================================================
export async function createMission(missionData) {
  const response = await client.post(
    "/missions",

    missionData,
  );

  return response.data;
}

// =================================================
// DELETE MISSION
// =================================================
export async function deleteMission(id) {
  const response = await client.delete(`/missions/${id}`);

  return response.data;
}

// =================================================
// ACCEPT MISSION
// =================================================
export async function acceptMission(id) {
  const response = await client.put(`/missions/${id}/accept`);

  return response.data;
}
