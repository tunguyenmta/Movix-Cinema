import { configureStore } from "@reduxjs/toolkit";

import cinemaSlice from "./cinemaSlice";

export const store = configureStore({
    reducer: {
        cinemaState: cinemaSlice,
    },
});