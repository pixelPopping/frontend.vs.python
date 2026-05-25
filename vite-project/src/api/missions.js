// src/api/missions.js

import client from "./client";

// ---------------- GET MISSIONS ----------------
export async function getMissions() {

    const response = await client.get("/missions");

    return response.data;
}

// ---------------- CREATE ----------------
export async function createMission(payload) {

    const response = await client.post(
        "/missions",
        payload
    );

    return response.data;
}

// ---------------- DELETE ----------------
export async function deleteMission(id) {

    const response = await client.delete(
        `/missions/${id}`
    );

    return response.data;
}

// ---------------- ACCEPT ----------------
export async function acceptMission(id) {

    const response = await client.put(
        `/missions/${id}/accept`
    );

    return response.data;
}