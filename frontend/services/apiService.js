import api from "./api";

export const login = (data) => api.post("/auth/login", data);
export const refresh = (data) => api.post("/auth/refresh", data);
export const logout = (data) => api.post("/auth/logout", data);

export const getDashboardStats = () => api.get("/dashboard/");

export const createUser = (data) => api.post("/users/", data);
export const getUsers = () => api.get("/users/");

export const getProjects = () => api.get("/projects/");
export const getProject = (id) => api.get(`/projects/${id}`);
export const createProject = (data) => api.post("/projects/", data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

export const getTasks = (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value && value !== "all") queryParams.append(key, value);
    });
    return api.get(`/tasks/?${queryParams.toString()}`);
};
export const getTask = (id) => api.get(`/tasks/${id}`);
export const createTask = (data) => api.post("/tasks/", data);
export const updateTaskStatus = (id, statusData) => api.patch(`/tasks/${id}/status`, statusData);
export const assignTask = (id, assignData) => api.patch(`/tasks/${id}/assign`, assignData);
