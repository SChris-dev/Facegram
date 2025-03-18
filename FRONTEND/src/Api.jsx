import axios from 'axios';

const Api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

Api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("login_token");

        // Exclude token for login and register requests
        if (!config.url.includes("/login") && !config.url.includes("/register")) {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

export default Api;