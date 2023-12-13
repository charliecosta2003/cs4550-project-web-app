import axios from "axios";

export const USERS_API = "http://localhost:4000/api/users";

const request = axios.create({withCredentials: true});

export const login = async (credentials) => {
    const response = await request.post(`${USERS_API}/login`, credentials);
    return response.data;
};

export const register = async (credentials) => {
    const response = await request.post(`${USERS_API}/register`, credentials);
    return response.data;
};

export const logout = async () => {
    const response = await request.post(`${USERS_API}/logout`);
    return response.data;
};

export const profile = async () => {
    const response = await request.post(`${USERS_API}/profile`);
    return response.data;
};

export const findAllUsers = async () => {
    const response = await request.get(USERS_API);
    return response.data;
};

export const findUserById = async (id) => {
    try {
        const response = await request.get(`${USERS_API}/${id}`);
        return response.data;
    }
    catch (e) {
        return null;
    }
};

export const updateUser = async (user, signedIn) => {
    const response = await request.put(`${USERS_API}/${user._id}?signedIn=${signedIn}`, user);
    return response.data;
};

export const deleteUser = async (user) => {
    const response = await request.delete(`${USERS_API}/${user._id}`);
    return response.data;
};