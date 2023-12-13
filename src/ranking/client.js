import axios from "axios";

export const RANKING_API = "http://localhost:4000/api/rankings";

const request = axios.create({withCredentials: true});

export const createRanking = async (userId, artistId, ranking, comment) => {
    const response = await request.post(RANKING_API, {userId, artistId, ranking, comment});
    return response.data;
};

export const findAllRankings = async () => {
    const response = await request.get(`${RANKING_API}/all`);
    return response.data;
};

export const findRanking = async (userId, artistId) => {
    const response = await request.get(`${RANKING_API}?userId=${userId}&artistId=${artistId}`);
    return response.data;
};

export const findUserRankings = async (userId) => {
    try {
        const response = await request.get(`${RANKING_API}/users/${userId}`);
        return response.data;
    } catch (error) {
        return [];
    }
};

export const findUsersRankings = async (userId1, userId2, userId3) => {
    const response = await request.get(`${RANKING_API}/users?userId1=${userId1}&userId2=${userId2}&userId3=${userId3}`);
    return response.data;
};

export const findArtistRankings = async (artistId) => {
    const response = await request.get(`${RANKING_API}/artists/${artistId}`);
    return response.data;
};

export const updateRanking = async (userId, artistId, ranking, comment) => {
    const response = await request.put(RANKING_API, {userId, artistId, ranking, comment});
    return response.data;
};

export const deleteRanking = async (userId, artistId) => {
    const response = await request.delete(`${RANKING_API}?userId=${userId}&artistId=${artistId}`);
    return response.data;
};