import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
   username: '',
   token: localStorage.getItem('accessToken') || '',
   isLoading: '',
   error: ''
}

// TO REGISTER USER IN THE DB:
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
         // PARSING JSON:
         const data = await response.json();

         // IF THERE IS NO RESPONSE, EXPLICITLY STOPS THE EXECUTION AS CATCH BLOCK DOES NOT CATCH THE HTTP STATUS CODES
         if (!response.ok) {
            return thunkApi.rejectWithValue(data);
         }

         // SETTING THE ACCESS TOKEN TO THE LOCALSTORAGE
         const token = data.token;
         localStorage.setItem('accessToken', token)
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
      signOut: (state) => {
         localStorage.removeItem("accessToken");
         state.token = ''
      }
   },
   extraReducers: (builder) => {
      builder
         // FOR REGISTERING THE USER:
         .addCase(registerUser.pending, (state) => {
            state.isLoading = true;
         })
         .addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.username = action.payload.username
         })
         .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
         })
         
   }
})

const authReducer = authSlice.reducer;

export const { signOut } = authSlice.actions;

export { authReducer }