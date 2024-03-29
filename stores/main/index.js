import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    selectedLanguage: { name: "Türkçe", value: "tr-TR" },
    languages: [
        { name: "Türkçe", value: "tr-TR" },
        { name: "English", value: "en-US" },
    ],

    isSheetOpen: false,

    titles: [],

    tiers: [],

    agents: [],

    playerCards: [],

    cardPreview: {
        title: "YR 1",
        username: "Lally",
        agentName: "Clove",
        agentImage: "https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/displayicon.png",
        cardImage:
            "https://media.valorant-api.com/playercards/e6529e9c-4a2b-c31c-7252-e185a8ce4a04/largeart.png",
        cardName: "Beta Kartı",
        bannerImage: "https://media.valorant-api.com/playercards/e6529e9c-4a2b-c31c-7252-e185a8ce4a04/wideart.png",
        type: "card",
        tierName: "Radiant",
        tierIcon: "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/7/largeicon.png",
    },

    formData: {
        title: "",
        username: "",
        cardImage: "",
        agent: "",
        tier: "",
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
        if (state.main.titles.length > 0) return state.main.titles;
        const response = await axios.get('https://valorant-api.com/v1/playertitles?language=' + state.main.selectedLanguage.value);
        return response.data;
    }
);

export const _getAgents = createAsyncThunk(
    'main/getAgents',
    async (payload, { dispatch, getState }) => {
        let state = getState();
        if (state.main.agents.length > 0) return state.main.agents;
        const response = await axios.get('https://valorant-api.com/v1/agents?isPlayableCharacter=true&language=' + state.main.selectedLanguage.value);
        return response.data;
    }
);

export const _getTiers = createAsyncThunk(
    'main/getTiers',
    async (payload, { dispatch, getState }) => {
        let state = getState();
        if (state.main.tiers.length > 0) return state.main.tiers;
        const response = await axios.get('https://valorant-api.com/v1/competitivetiers?language=' + state.main.selectedLanguage.value);
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

        _setSheetOpen: (state, action) => {
            state.isSheetOpen = action.payload;
        }

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
            })
            .addCase(_getAgents.pending, (state) => {
                // API çağrısı başladığında durumu güncelle
                state.isLoading = true;
            })
            .addCase(_getAgents.fulfilled, (state, action) => {
                // API çağrısı başarılı olduğunda durumu güncelle
                state.isLoading = false;
                state.agents = action.payload.data;
                console.log(action.payload.data);
            })
            .addCase(_getAgents.rejected, (state, action) => {
                // API çağrısı başarısız olduğunda durumu güncelle
                state.isLoading = false;
                console.log(action.error.message);
            })
            .addCase(_getTiers.pending, (state) => {
                // API çağrısı başladığında durumu güncelle
                state.isLoading = true;
            })
            .addCase(_getTiers.fulfilled, (state, action) => {
                // API çağrısı başarılı olduğunda durumu güncelle
                state.isLoading = false;
                state.tiers = action.payload.data[0].tiers.filter((tier) => tier.largeIcon !== null);
                console.log(action.payload.data[0].tiers.filter((tier) => tier.largeIcon !== null));
            })
            .addCase(_getTiers.rejected, (state, action) => {
                // API çağrısı başarısız olduğunda durumu güncelle
                state.isLoading = false;
                console.log(action.error.message);
            });
    },
});





export const { _setLoading, _setCardPreview, _setLanguages, _setSelectedLanguage, _setFormData, _setSheetOpen } = MainSlice.actions;

export default MainSlice.reducer;