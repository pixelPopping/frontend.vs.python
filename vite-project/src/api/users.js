import client from "./client";

// =================================================
// DEMO USERS
// =================================================

const DEMO_USERS = [
  {
    id: "demo-crew-1",
    username: "Demo Crew 1",
    email: "crew1@demo.com",
    role: "crew",
  },
  {
    id: "demo-crew-2",
    username: "Demo Crew 2",
    email: "crew2@demo.com",
    role: "crew",
  },
  {
    id: "demo-crew-3",
    username: "Demo Crew 3",
    email: "crew3@demo.com",
    role: "crew",
  },
];

// =================================================
// GET USERS
// =================================================

export async function getUsers() {
  try {
    const response = await client.get("/users");

    const data = response.data;

    // Backend geeft direct een array terug
    if (Array.isArray(data)) {
      console.log("✅ Users loaded from backend");

      return data;
    }

    // Voor het geval de backend { users: [...] } teruggeeft
    if (Array.isArray(data?.users)) {
      console.log("✅ Users loaded from backend");

      return data.users;
    }

    // Ongeldige response
    throw new Error(
      "Ongeldige users response."
    );
  } catch (error) {
    console.warn(
      "⚠️ Users backend unavailable."
    );

    console.warn(
      "Using demo users."
    );

    return DEMO_USERS;
  }
}