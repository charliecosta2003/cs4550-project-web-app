import axios from "axios";

export const ALBUMS_API = "http://localhost:4000/api/albums";

const request = axios.create({withCredentials: true});

export const createAlbum = async (album) => {
    const response = await request.post(ALBUMS_API, album);
    return response.data;
};

export const findAlbumById = async (albumId) => {
    const response = await request.get(`${ALBUMS_API}/${albumId}`);
    return response.data;
};