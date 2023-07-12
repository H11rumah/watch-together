import { configureStore } from "@reduxjs/toolkit";
import playerSliceReducer from "./slices/playerSlice";
import webSliceReducer from "./slices/webSlice";

export const store = configureStore({
    reducer: {
        player: playerSliceReducer,
        web: webSliceReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
