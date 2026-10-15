import { createSlice } from "@reduxjs/toolkit";


const initialState = {
   isAiChatOpen: false,
   aiChatLoggedInUserId: ''
}


const aiBotSlice = createSlice({
   name: 'aiBot',
   initialState,
   reducers: {
      openAiChat: (state) => {
         state.isAiChatOpen = true;
      },
      closeAiChat: (state) => {
         state.isAiChatOpen = false;
      },
      setAiChatLoggedInUserId: (state, action) => {
         state.aiChatLoggedInUserId = action.payload;
      },
      removeAiChatLoggedInUserId: (state) => {
         state.aiChatLoggedInUserId = '';
      }
   }
})


const aiBotReducer = aiBotSlice.reducer;

export const {openAiChat, closeAiChat, setAiChatLoggedInUserId, removeAiChatLoggedInUserId} = aiBotSlice.actions;

export default aiBotReducer;