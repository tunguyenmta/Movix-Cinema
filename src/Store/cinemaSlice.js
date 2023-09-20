import { createSlice } from "@reduxjs/toolkit";

export const cinemaSlice = createSlice({
    name: "cinema",
    initialState: {
        url: {},
        genres: {},
        listGenres: [],
        seatInfo: {},
        movie: {},
        lsMoviesInCinema: {}
    },
    reducers: {
        getApiConfiguration: (state, action) => {
            state.url = action.payload;
        },
        getGenres: (state, action) => {
            state.genres = action.payload;
        },
        fetchGenres: (state, action) => {
            
            state.listGenres = action.payload;
        },
        getSeatInfo: (state, action) =>{
            state.seatInfo = action.payload;
        },
        getMovieInfo: (state, action) =>{
            state.movieInfo = action.payload;
        },
        getMoviesInCinema: (state, action)=>{
            state.lsMoviesInCinema = action.payload
        }
    },
});

// Action creators are generated for each case reducer function
export const { getApiConfiguration, getGenres, fetchGenres, getSeatInfo, getMovieInfo, getMoviesInCinema } = cinemaSlice.actions;

export default cinemaSlice.reducer;