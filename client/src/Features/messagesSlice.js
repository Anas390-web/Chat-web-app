import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'


const initialState = {
   allMessagesDocs: [],
   allGroupMessagesDocs: [],
   isLoading: true,
   error: ''
}

// TO GET ALL ONE-ON-ONE CHAT MESSAGES:
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

// GET ALL GROUP MESSAGES:
export const allGroupMessages = createAsyncThunk(
   'messages/allGroupMessages',
   async (groupId, thunkApi) => {
      try {
         const token = localStorage.getItem("accessToken");
         const response = await fetch(`${import.meta.env.VITE_SERVER_GROUP_MESSAGES_URL}`, {
            method: 'POST',
            headers: {
               'Authorization': `Bearer ${token}`,
               'content-type': 'application/json'
            },
            body: JSON.stringify(
               groupId
            )
         });
         const data = await response.json();
         if(!response.ok){
            return thunkApi.rejectWithValue(data);
         }
         console.log(data);
         return data;
      } catch (error) {
         console.log('Error occurred while sending request to get all Group messages:', error.message);
         return thunkApi.rejectWithValue(error.message);
      }
   }
)

const messagesSlice = createSlice({
   name: 'messages',
   initialState,
   reducers: {
      addLatestMsg: (state, action) => {
         state.allMessagesDocs.push(action.payload)
      },
      addLatestGroupMsg: (state, action) => {
         state.allGroupMessagesDocs.push(action.payload);
      }
   },
   extraReducers: (builder) => {
      builder
         // FOR ONE-ON-ONE CHAT MESSAGES:
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
         // FOR GROUP CHAT MESSAGES:
         .addCase(allGroupMessages.pending, (state, action) => {
            state.isLoading = true
         })
         .addCase(allGroupMessages.fulfilled, (state, action) => {
            state.isLoading = false;
            state.allGroupMessagesDocs = action.payload.groupMessagesDocs;
         })
         .addCase(allGroupMessages.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload
         })
   }
})

const messagesReducer = messagesSlice.reducer;

export const { addLatestMsg, addLatestGroupMsg } = messagesSlice.actions;

export default messagesReducer;