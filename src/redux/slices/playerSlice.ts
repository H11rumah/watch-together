import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Item = {
    imgUrl: string;
    title: string;
    ytUrl: string;
};

type PlayerState = {
    items: Item[];
    currentItem: string;
    isPlay: boolean;
    isEnd: boolean;
    isRepeatVideo: boolean;
};

const initialState: PlayerState = {
    items: [],
    currentItem: "",
    isPlay: false,
    isEnd: false,
    isRepeatVideo: false,
};

export const playerSlice = createSlice({
    name: "playlist",
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<Item[]>) => {
            state.items = action.payload;
        },

        setCurrentItem: (state, action: PayloadAction<string>) => {
            state.currentItem = action.payload;
        },

        setIsPlay: (state, action: PayloadAction<boolean>) => {
            state.isPlay = action.payload;
        },

        setIsEnd: (state, action: PayloadAction<boolean>) => {
            state.isEnd = action.payload;
        },

        setIsRepeatVideo: (state, action: PayloadAction<boolean>) => {
            state.isRepeatVideo = action.payload;
        },
    },
});

export const { setItems, setIsPlay, setCurrentItem, setIsEnd, setIsRepeatVideo } = playerSlice.actions;

export default playerSlice.reducer;
