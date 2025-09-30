import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        messages: [],
        currentChat: null,
        loading: false,
        error: null
    },
    reducers: {
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setCurrentChat: (state, action) => {
            state.currentChat = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearChat: (state) => {
            state.messages = [];
            state.currentChat = null;
            state.error = null;
        }
    }
});

export const {
    setMessages,
    addMessage,
    setCurrentChat,
    setLoading,
    setError,
    clearChat
} = chatSlice.actions;

export default chatSlice.reducer;
