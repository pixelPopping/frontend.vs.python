import client from "./client";

// =================================================
// LOGIN
// =================================================
export async function loginUser(data) {
  const response = await client.post("/login", {
    username: data.username,
    password: data.password,
    inviteCode: data.inviteCode,
  });

  return response.data;
}

// =================================================
// REGISTER
// =================================================
export async function registerUser(data) {
  const response = await client.post(
    "/register",
    data,
  );

  return response.data;
}

// =================================================
// CURRENT USER
// =================================================
export async function getMe() {
  const response = await client.get("/me");

  return response.data;
}