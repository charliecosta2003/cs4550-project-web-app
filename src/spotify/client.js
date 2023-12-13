import axios from "axios";

export const SPOTIFY_API = "http://localhost:4000/api/spotify";

const request = axios.create({withCredentials: true});

export const fetchSearchResults = async (query) => {
    const response = await request.get(`${SPOTIFY_API}/search?query=${query}`);
    return response.data;
};

export const fetchArtistAlbums = async (artistId) => {
    try {
        const response = await request.get(`${SPOTIFY_API}/details/${artistId}/albums`);
        return response.data.items;
    } catch (error) {
        return null;
    }
};

export const fetchArtistDetails = async (artistId) => {
    try {
        const response = await request.get(`${SPOTIFY_API}/details/${artistId}`);
        return response.data;
    } catch (error) {
        return null;
    }
};

export const fetchAlbumDetails = async (albumId) => {
    try {
        const response = await request.get(`${SPOTIFY_API}/albums/${albumId}`);
        return response.data;
    } catch (error) {
        return null;
    }
};

export const fetchRelatedArtists = async (artistId) => {
    try {
        const response = await request.get(`${SPOTIFY_API}/details/${artistId}/related`);
        return response.data.artists;
    } catch (error) {
        return null;
    }
}