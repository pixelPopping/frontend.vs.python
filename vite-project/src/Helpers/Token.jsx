const API = "/api";

export function fetchWithAuth(url, options = {}) {
const token = localStorage.getItem("token");

return fetch(`${API}${url}`, {
...options,
headers: {
...options.headers,
...(token
? {
Authorization: `Bearer ${token}`,
}
: {}),
"Content-Type": "application/json",
},
});
}
