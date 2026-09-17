import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
   allUsers: [],
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

// TO LOGIN USER IN THE DASHBOARD:
export const loginUser = createAsyncThunk(
   'auth/loginUser',
   async (userData, thunkApi) => {
      try {
         const response = await fetch(`${import.meta.env.VITE_BASE_SERVER_URL}/auth/login`, {
            method: 'POST',
            headers: {
               'content-type': 'application/json'
            },
            body: JSON.stringify(
               userData
            )
         })
         const data = await response.json();
         if (!response.ok) {
            return thunkApi.rejectWithValue(data)
         }
         // SAVE TOKEN TO LOCAL STORAGE:
         const token = data.token;
         localStorage.setItem("accessToken", token);
         return data;
      } catch (error) {
         console.log(error)
      }
   }
)

// GET ALL THE USERS:
export const getAllUsers = createAsyncThunk(
   'auth/getAllUsers',
   async (token, thunkApi) => {
      try {
         const response = await fetch(`${import.meta.env.VITE_BASE_SERVER_URL}/auth`, {
            method: 'GET',
            headers: {
               'Authorization': `Bearer ${token}`,
               'content-type': 'application/json'
            }
         })
         const data = await response.json();
         if (!response.ok) {
            return thunkApi.rejectWithValue(data);
         }
         return data;
      } catch (error) {
         console.log(error);
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
            state.username = action.payload.username;
         })
         .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
         })
         // AFTER USER LOGIN:
         .addCase(loginUser.pending, (state) => {
            state.isLoading = true
         })
         .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.token = action.payload.token;
            state.username = action.payload.user.username;
         })
         .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
         })
         // AFTER GETTING ALL THE USERS:
         .addCase(getAllUsers.pending, (state) => {
            state.isLoading = true;
         })
         .addCase(getAllUsers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.allUsers = action.payload.allUsers;
         })
         .addCase(getAllUsers.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
         })
   }
})

const authReducer = authSlice.reducer;

export const { signOut } = authSlice.actions;

export { authReducer }