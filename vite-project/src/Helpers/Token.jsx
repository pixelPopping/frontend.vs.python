const API = "http://localhost:5000/api";

export function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem("token");

    return fetch(`${API}${url}`, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
}