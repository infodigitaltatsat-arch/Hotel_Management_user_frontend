import api from "./api";

export const registerGuest = async (guestData) => {
    const response = await api.post("/auth/register", guestData);
    return response.data;
};

export const loginGuest = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
};