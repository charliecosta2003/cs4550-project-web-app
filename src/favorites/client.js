import axios from "axios";

export const FAVORITES_API = "http://localhost:4000/api/favorites";

const request = axios.create({withCredentials: true});

export const createFavorite = async (userId, artistId) => {
    const response = await request.post(`${FAVORITES_API}`, {userId, artistId});
    return response.data;
};

export const favoriteExists = async (userId, artistId) => {
    const response = await request.get(`${FAVORITES_API}?userId=${userId}&artistId=${artistId}`);
    return !!response.data;
};

export const findUserFavorites = async (userId) => {
    try {
        const response = await request.get(`${FAVORITES_API}/${userId}`);
        return response.data.map(favorite => favorite.artist);
    } catch (error) {
        return [];
    }
};

export const findAllFavorites = async () => {
    try {
        const response = await request.get(`${FAVORITES_API}/all`);
        return response.data;
    } catch (error) {
        return [];
    }
}

export const deleteFavorite = async (userId, artistId) => {
    const response = await request.delete(`${FAVORITES_API}?userId=${userId}&artistId=${artistId}`);
    return response.data;
};

