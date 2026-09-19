import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
   contactList: [],
   username: '',
   userImageSrc: '',
   isLoading: true,
   error: ''
}

// ADD USERS/CHATS:
export const addUsers = createAsyncThunk(
   'contactList/addUsers',
   async(users, thunkApi) => {
      try {
         const token = localStorage.getItem("accessToken");
         const response = await fetch(`${import.meta.env.VITE_BASE_SERVER_URL}/contacts`, {
            method: 'POST',
            headers: {
               'Authorization': `Bearer ${token}`,
               'content-type': 'application/json'
            },
            body: JSON.stringify(
               users
            )
         })
         const data = await response.json();
         console.log(data);
         if(!response.ok){
            return thunkApi.rejectWithValue(data);
         }
         return data;
      } catch (error) {
         console.log(error.message);
         return thunkApi.rejectWithValue(error);
      }
   }
)

const contactListSlice = createSlice({
   name: 'contactList',
   initialState,
   reducers: {
      
   }
})


const contactListReducer = contactListSlice.reducer;

export {contactListReducer}