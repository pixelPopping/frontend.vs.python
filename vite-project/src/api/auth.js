import client from "./client";

export const loginUser = async (credentials) => {
    const response = await client.post("/login", credentials);
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await client.post("/register", userData);
    return response.data;
};

export const getMe = async () => {
    const response = await client.get("/me");
    return response.data;
};