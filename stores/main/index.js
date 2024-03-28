import { createSlice } from "@reduxjs/toolkit";

const MainSlice = createSlice({
    name: "main",
    initialState: {
        isLoading: false,
    },
    reducers: {
        _setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
});


export const { _setLoading } = MainSlice.actions;

export default MainSlice.reducer;