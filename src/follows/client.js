import axios from "axios";

export const FOLLOWS_API = "http://localhost:4000/api/follows";

const request = axios.create({withCredentials: true});

export const createFollow = async (followerId, followingId) => {
    const follow = {followerId, followingId};
    const response = await request.post(FOLLOWS_API, follow);
    return response.data;
};

export const followExists = async (followerId, followingId) => {
    try {
        const response = await request.get(`${FOLLOWS_API}?followerId=${followerId}&followingId=${followingId}`);
        return !!response.data;
    } catch (error) {
        return false;
    }
};

export const findUserFollowers = async (userId) => {
    try {
        const response = await request.get(`${FOLLOWS_API}/${userId}/followers`);
        return response.data.map(follow => follow.follower);
    } catch (error) {
        return [];
    }
};

export const findUserFollowing = async (userId) => {
    try {
        const response = await request.get(`${FOLLOWS_API}/${userId}/following`);
        return response.data.map(follow => follow.following);
    } catch (error) {
        return [];
    }
};

export const deleteFollow = async (followerId, followingId) => {
    const response = await request.delete(`${FOLLOWS_API}?followerId=${followerId}&followingId=${followingId}`);
    return response.data;
};