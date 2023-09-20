import axios from "axios";
const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN
// const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY
const headers = {
    Authorization: "bearer " + TMDB_TOKEN,
};
export const fetchDataFromApi = async (url, params) => {
    try {
        const { data } = await axios.get(url, {
            params,
        });
        return data;
    } catch (err) {
        console.log(err);
        return err;
    }
};

export const fetchDataFromTMDB = async (url, params) => {
    try {
        const { data } = await axios.get((BASE_URL+url), {
            headers,
            params,
        });
        return data;
    } catch (err) {
        console.log(err);
        return err;
    }
};