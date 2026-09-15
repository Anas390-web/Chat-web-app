import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
   username: '',
   token: '',
   isLoading: '',
   error: ''
}

export const registerUser = createAsyncThunk(
   'auth/registerUser',
   async (userFormData, thunkApi) => {
      try {
         console.log(userFormData);
         const response = await fetch(`${import.meta.env.VITE_BASE_SERVER_URL}/auth/register`, {
            method: 'POST',
            headers: {
               'content-type': 'application/json'
            },
            body: JSON.stringify(
               userFormData
            )
         })
         const data = await response.json();
         console.log('data' ,data);
         if(!response.ok) {
            return thunkApi.rejectWithValue(data);
         }
         return data;
      } catch (error) {
         console.log(error.message)
         return thunkApi.rejectWithValue(error.message || 'Netword request failed')
      }
   }
)

const authSlice = createSlice({
   name: 'register',
   initialState,
   reducers: {

   },
   extraReducers: (builder) => {

   }
})

const authReducer = authSlice.reducer;

export { authReducer }