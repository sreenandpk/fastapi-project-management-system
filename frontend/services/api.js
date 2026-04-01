import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                if (typeof window !== "undefined") {
                    const refreshToken = localStorage.getItem("refresh_token");
                    
                    if (refreshToken) {
                        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
                            refresh_token: refreshToken
                        });

                        const { access_token, refresh_token: new_refresh } = res.data;

                        localStorage.setItem("access_token", access_token);
                        if (new_refresh) {
                            localStorage.setItem("refresh_token", new_refresh);
                        }

                        originalRequest.headers.Authorization = `Bearer ${access_token}`;

                        return api(originalRequest);
                    }
                }
            } catch (err) {
                console.error("Token refresh failed, redirecting to login...", err);
                if (typeof window !== "undefined") {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    window.location.href = "/";
                }
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;