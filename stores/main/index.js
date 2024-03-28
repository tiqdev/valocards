import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    selectedLanguage: { name: "Türkçe", value: "tr-TR" },
    languages: [
        { name: "Türkçe", value: "tr-TR" },
        { name: "English", value: "en-US" },
    ],

    titles: [],

    competitiveTiers: [],

    playerCards: [],

    cardPreview: {
        title: "Miyav",
        username: "Zena",
        cardImage:
            "https://media.valorant-api.com/playercards/109ea8c8-b372-4fe0-be3c-a5c3e549b38a/largeart.png",
        cardName: "KÜBİK TİLKİ KARTI",
        alignment: "vertical",
    },

    formData: {
        title: "",
        username: "",
        cardImage: "",
        cardName: "",
        alignment: "vertical",
    },

    apiError: {
        isError: false,
        message: "",
    },

};



export const _getPlayerCards = createAsyncThunk(
    'main/getPlayerCards',
    async (payload, { dispatch, getState }) => {
        let state = getState();
        const response = await axios.get('https://valorant-api.com/v1/playercards?language=' + state.main.selectedLanguage.value);
        return response.data;
    }
);


export const _getTitles = createAsyncThunk(
    'main/getTitles',
    async (payload, { dispatch, getState }) => {
        let state = getState();
        const response = await axios.get('https://valorant-api.com/v1/playertitles?language=' + state.main.selectedLanguage.value);
        return response.data;
    }
);



const MainSlice = createSlice({
    name: "main",
    initialState,
    reducers: {
        _setLoading: (state, action) => {
            state.isLoading = action.payload;
        },

        _setSelectedLanguage: (state, action) => {
            state.selectedLanguage = action.payload;
        },

        _setLanguages: (state, action) => {
            state.languages = action.payload;
        },

        _setCardPreview: (state, action) => {
            state.cardPreview = action.payload;
        },

        _setFormData: (state, action) => {
            state.formData = action.payload;
        },

    },

    extraReducers: (builder) => {
        builder
            .addCase(_getTitles.pending, (state) => {
                // API çağrısı başladığında durumu güncelle
                state.isLoading = true;
            })
            .addCase(_getTitles.fulfilled, (state, action) => {
                // API çağrısı başarılı olduğunda durumu güncelle
                state.isLoading = false;
                state.titles = action.payload.data.sort((a, b) => {
                    if (a.titleText < b.titleText) {
                        return -1;
                    }
                    if (a.titleText > b.titleText) {
                        return 1;
                    }
                    return 0;
                });
            })
            .addCase(_getTitles.rejected, (state, action) => {
                // API çağrısı başarısız olduğunda durumu güncelle
                state.isLoading = false;
                console.log(action.error.message);
            })
            .addCase(_getPlayerCards.pending, (state) => {
                // API çağrısı başladığında durumu güncelle
                state.isLoading = true;
            })
            .addCase(_getPlayerCards.fulfilled, (state, action) => {
                // API çağrısı başarılı olduğunda durumu güncelle
                state.isLoading = false;
                state.playerCards = action.payload.data;
                console.log(action.payload.data);
            })
            .addCase(_getPlayerCards.rejected, (state, action) => {
                // API çağrısı başarısız olduğunda durumu güncelle
                state.isLoading = false;
                console.log(action.error.message);
            });
    },
});





export const { _setLoading, _setCardPreview, _setLanguages, _setSelectedLanguage, _setFormData } = MainSlice.actions;

export default MainSlice.reducer;