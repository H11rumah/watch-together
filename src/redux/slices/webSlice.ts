import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // webSocket: new WebSocket("ws://localhost:5000/"),
    webSocket: new WebSocket("wss://watch-togerther-server.onrender.com/"),
    apiToken: "AIzaSyDL-IqaQL_C_OnWHnyHeBedVzCTKqDgtms",
    roomId: "",
    username: "",
    members: [],
    isOwner: false,
    isConnected: false,
};

export const webSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        setWebSocket: (state, action) => {
            state.webSocket = action.payload;
        },

        setRoomId: (state, action) => {
            state.roomId = action.payload;
        },

        setUsername: (state, action) => {
            state.username = action.payload;
        },

        setMembers: (state, action) => {
            state.members = action.payload;
        },

        setIsOwner: (state, action) => {
            state.isOwner = action.payload;
        },

        setIsConnected: (state, action) => {
            state.isConnected = action.payload;
        },
    },
});

export const { setWebSocket, setRoomId, setUsername, setMembers, setIsOwner, setIsConnected } = webSlice.actions;

export default webSlice.reducer;
