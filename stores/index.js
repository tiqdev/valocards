import { configureStore } from "@reduxjs/toolkit";
import MainSlice from "./main";

const store = configureStore({
    reducer: {
        main: MainSlice,
    },
});

export default store;