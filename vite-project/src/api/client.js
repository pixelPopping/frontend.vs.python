import axios from "axios";

const client = axios.create({

    baseURL: "http://localhost:5000/api",

    headers: {
        "Content-Type": "application/json",
    },
});

// =================================================
// REQUEST INTERCEPTOR
// =================================================
client.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem("token");

        console.log(
            "TOKEN:",
            token
        );

        console.log(
            "REQUEST URL:",
            config.url
        );

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        console.log(
            "REQUEST HEADERS:",
            config.headers
        );

        return config;
    },

    (error) => {

        console.error(
            "REQUEST ERROR:",
            error
        );

        return Promise.reject(error);
    }
);

// =================================================
// RESPONSE INTERCEPTOR
// =================================================
client.interceptors.response.use(

    (response) => {

        console.log(
            "API RESPONSE:",
            response
        );

        return response;
    },

    (error) => {

        console.error(
            "API ERROR:",
            error.response || error
        );

        return Promise.reject(error);
    }
);

export default client;