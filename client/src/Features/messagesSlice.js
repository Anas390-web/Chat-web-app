import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'


const initialState = {
   allMessagesDocs: [],
   isLoading: true,
   error: ''
}

// TO GET ALL MESSAGES:
export const allMessages = createAsyncThunk(
   'messages/allMessages',
   async (conversationData, thunkApi) => {
      try {
         const token = localStorage.getItem("accessToken");
         const response = await fetch(import.meta.env.VITE_SERVER_MESSAGES_URL, {
            method: 'POST',
            headers: {
               'Content-type': 'application/json',
               'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(
               conversationData
            )
         })
         const data = await response.json();
         if (!response.ok) {
            return thunkApi.rejectWithValue(data)
         }
         return data;
      } catch (error) {
         console.log('Error:', error.message)
         return thunkApi.rejectWithValue(error.message)
      }
   }
)

const messagesSlice = createSlice({
   name: 'messages',
   initialState,
   reducers: {
      addLatestMsg: (state, action) => {
         state.allMessagesDocs.push(action.payload)
      }
   },
   extraReducers: (builder) => {
      builder
         .addCase(allMessages.pending, (state) => {
            state.isLoading = true
         })
         .addCase(allMessages.fulfilled, (state, action) => {
            state.isLoading = false;
            state.allMessagesDocs = action.payload.allMessagesDocs;
         })
         .addCase(allMessages.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload
         })
   }
})

const messagesReducer = messagesSlice.reducer;

export const { addLatestMsg } = messagesSlice.actions;

export default messagesReducer;