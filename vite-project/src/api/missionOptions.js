import client from "./client";

export async function getMissionOptions() {

    const response = await client.get(
        "/mission-options"
    );

    return response.data;
}