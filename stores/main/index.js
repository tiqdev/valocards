import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    selectedLanguage: { name: "Türkçe", value: "tr-TR" },
    languages: [
        { name: "English", value: "en-US", flag: "🇺s", short: "en" },
        { name: "Türkçe", value: "tr-TR", flag: "🇹🇰", short: "tr" },
        { name: "Русский", value: "ru-RU", flag: "🇷🇺🇺", short: "ru" },
    ],

    translations: {
        "en-US": {
            "username": "Username",
            "select_username": "Your cool username",
            "title": "Title",
            "select_title": "Select a title",
            "agent": "Agent",
            "select_agent": "Select an agent",
            "tier": "Tier",
            "select_tier": "Select a tier",
            "card": "Player Card",
            "generate_button": "Generate",
            "language_label": "Language",
            "vertical_label": "Vertical",
            "horizontal_label": "Horizontal",
            "edit_label": "Edit",
            "download_label": "Download"
        },
        "tr-TR": {
            "username": "Kullanıcı Adı",
            "select_username": "Havalı kullanıcı adınız",
            "title": "Ünvan",
            "select_title": "Bir ünvan seçin",
            "agent": "Ajan",
            "select_agent": "Bir ajan seçin",
            "tier": "Derece",
            "select_tier": "Bir derece seçin",
            "card": "Oyuncu Kartı",
            "generate_button": "Oluştur",
            "language_label": "Dil",
            "vertical_label": "Dikey",
            "horizontal_label": "Yatay",
            "edit_label": "Düzenle",
            "download_label": "İndir"
        },
        "ru-RU": {
            "username": "Имя пользователя",
            "select_username": "Твоё круто имя пользователя",
            "title": "Титул",
            "select_title": "Выбери титул",
            "agent": "Агент",
            "select_agent": "Выбери агента",
            "tier": "Ранг",
            "select_tier": "Выбери ранг",
            "card": "Карточка игрока",
            "generate_button": "Генерировать",
            "language_label": "Язык",
            "vertical_label": "Вертикальное положение",
            "horizontal_label": "Горизонтальное положение",
            "edit_label": "Редактировать",
            "download_label": "Скачать"
        },
    },

    isSheetOpen: false,

    isPng: true,

    titles: [],

    tiers: [],

    agents: [],
    playerCards: [],

    cardPreview: {
        title: "YR 1",
        username: "Zena",
        agentName: "OMEN",
        agentImage: "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/displayicon.png",
        cardImage:
            "https://media.valorant-api.com/playercards/504f38e4-4874-845c-ccb6-a3aec7a3a1eb/largeart.png",
        cardName: "Omen Kartı",
        bannerImage: "https://media.valorant-api.com/playercards/504f38e4-4874-845c-ccb6-a3aec7a3a1eb/wideart.png",
        type: "card",
        tierName: "ÖLÜMSÜZLÜK 3",
        tierIcon: "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/23/largeicon.png",
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
        },

        _setIsPng: (state, action) => {
            state.isPng = action.payload;
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
            })
            .addCase(_getPlayerCards.pending, (state) => {
                // API çağrısı başladığında durumu güncelle
                state.isLoading = true;
            })
            .addCase(_getPlayerCards.fulfilled, (state, action) => {
                // API çağrısı başarılı olduğunda durumu güncelle
                state.isLoading = false;
                state.playerCards = action.payload.data;
            })
            .addCase(_getPlayerCards.rejected, (state, action) => {
                // API çağrısı başarısız olduğunda durumu güncelle
                state.isLoading = false;
            })
            .addCase(_getAgents.pending, (state) => {
                // API çağrısı başladığında durumu güncelle
                state.isLoading = true;
            })
            .addCase(_getAgents.fulfilled, (state, action) => {
                // API çağrısı başarılı olduğunda durumu güncelle
                state.isLoading = false;
                state.agents = action.payload.data;
            })
            .addCase(_getAgents.rejected, (state, action) => {
                // API çağrısı başarısız olduğunda durumu güncelle
                state.isLoading = false;
            })
            .addCase(_getTiers.pending, (state) => {
                // API çağrısı başladığında durumu güncelle
                state.isLoading = true;
            })
            .addCase(_getTiers.fulfilled, (state, action) => {
                // API çağrısı başarılı olduğunda durumu güncelle
                state.isLoading = false;
                state.tiers = action.payload.data[0].tiers.filter((tier) => tier.largeIcon !== null);
            })
            .addCase(_getTiers.rejected, (state, action) => {
                // API çağrısı başarısız olduğunda durumu güncelle
                state.isLoading = false;
            });
    },
});





export const { _setLoading, _setCardPreview, _setLanguages, _setSelectedLanguage, _setFormData, _setSheetOpen, _setIsPng } = MainSlice.actions;

export default MainSlice.reducer;
