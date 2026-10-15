import { createSlice } from "@reduxjs/toolkit";


const initialState = {
   isAiChatOpen: false
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
      }
   }
})


const aiBotReducer = aiBotSlice.reducer;

export const {openAiChat, closeAiChat} = aiBotSlice.actions;

export default aiBotReducer;