import axios from "axios";

export const ARTISTS_API = "http://localhost:4000/api/artists";

const request = axios.create({withCredentials: true});

export const createArtist = async (artist) => {
    const response = await request.post(ARTISTS_API, artist);
    return response.data;
};

export const findArtistById = async (artistId) => {
    const response = await request.get(`${ARTISTS_API}/${artistId}`);
    return response.data;
};