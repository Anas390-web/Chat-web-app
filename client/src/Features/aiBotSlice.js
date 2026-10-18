import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const initialState = {
   isAiChatOpen: false,
   aiChatLoggedInUserId: '',
   allAiChatMessages: [],
   isLoading: false,
   error: ''
}


// GET ALL THE AI CHAT MESSAGES:
export const getAllAiChatMessages = createAsyncThunk(
   'aiBot/getAllAiChatMessages',
   async (_, thunkApi) => {
      try {
         const token = localStorage.getItem("accessToken");
         const response = await fetch(`${import.meta.env.VITE_BASE_SERVER_URL}/ai/chat`, {
            method: 'GET',
            headers: {
               'Authorization': `Bearer ${token}`,
               'Content-type': 'application/json'
            }
         });
         const data = await response.json();
         if (!response.ok) {
            return thunkApi.rejectWithValue({
               status: response.status,
               message: data.message
            })
         }
         return data;
      } catch (error) {
         console.log('ERROR OCCURED DURING GETTING ALL AI CHAT MESSAGES:', error.message);
         return thunkApi.rejectWithValue(error.message);
      }
   }
)


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
      },
      addLatestAiChatMessage: (state, action) => {
         state.allAiChatMessages.push(action.payload);
      }
   },
   extraReducers: (builder) => {
      builder
         .addCase(getAllAiChatMessages.pending, (state) => {
            state.isLoading = true;
         })
         .addCase(getAllAiChatMessages.fulfilled, (state, action) => {
            state.isLoading = false;
            state.allAiChatMessages = action.payload.allAiChatMessages;
         })
         .addCase(getAllAiChatMessages.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
         })
   }
})


const aiBotReducer = aiBotSlice.reducer;

export const { openAiChat, closeAiChat, setAiChatLoggedInUserId, removeAiChatLoggedInUserId, addLatestAiChatMessage } = aiBotSlice.actions;

export default aiBotReducer;