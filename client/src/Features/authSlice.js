import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode';

const initialState = {
   allUsers: [],
   loggedInUserId: getUserIdFromToken() || '',
   username: getUserNameFromToken() || '',
   userAvatar: {},
   token: localStorage.getItem('accessToken') || '',
   selectedUserToChatData: {},
   selectedGroupToChatData: {},
   isLoading: '',
   error: ''
}

// TO GET THE USER ID FROM THE DECODED TOKEN:
function getUserIdFromToken() {
   try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
         return;
      }
      // DECODING THE TOKEN:
      const decodedToken = jwtDecode(token);
      // CURRENT TIME:
      const currentTime = Date.now() / 1000;
      // CHECK IF TOKEN IS EXPIRED:
      if (decodedToken.exp < currentTime) {
         console.log('Access Token is expired. Clearing Token from storage');
         localStorage.removeItem("accessToken");
         return;
      }
      // GET THE USER ID FROM DECODED TOKEN:
      const userId = String(decodedToken.userId);
      return userId;
   } catch (error) {
      console.log('Error while decoding Token: ', error.message);
      return;
   }
}

// TO GET USERNAME FROM TOKEN BY DECODING:
function getUserNameFromToken() {
   try {
      // GET TOKEN FROM LOCAL STORAGE:
      const token = localStorage.getItem("accessToken");
      // DECODE TOKEN:
      const decodedToken = jwtDecode(token);
      // FIND OUT THE CURRENT TIME:
      const currentTime = Date.now() / 1000;
      // CHECK IF TOKEN HAS EXPIRED:
      if (decodedToken.exp < currentTime) {
         console.log('Access Token is expired. Clearing Token from storage');
         localStorage.removeItem("accessToken");
         return;
      }
      // DE-STRUCTURE USERNAME FROM DECODED TOKEN:
      const { username } = decodedToken;
      return username;
   } catch (error) {
      console.log('Error while decoding token:' ,error.message)
   }
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
            return thunkApi.rejectWithValue({
               status : response?.status,
               message: data?.msg
            });
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
            return thunkApi.rejectWithValue({
               status: response.status,
               message: data.msg
            })
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

// GET SELECTED USER TO CHAT WITH DATA:
export const getUserToChatWithData = createAsyncThunk(
   'auth/getUserToChatWithData',
   async (selectedUserId, thunkApi) => {
      try {
         const token = localStorage.getItem("accessToken");
         const response = await fetch(`${import.meta.env.VITE_BASE_SERVER_URL}/auth/${selectedUserId}`, {
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
         console.log('Error happened while request for a specific user:', error.message);
         return thunkApi.rejectWithValue(data);
      }
   }
)

// GET SELECTED GROUP TO CHAT IN DATA:
export const getSelectedGroupData = createAsyncThunk(
   'auth/getSelectedGroupData',
   async (groupId, thunkApi) => {
      try {
         const token = localStorage.getItem("accessToken");
         const response = await fetch(`${import.meta.env.VITE_BASE_SERVER_URL}/auth/groups/${groupId}`, {
            method: 'GET',
            headers: {
               'Authorization': `Bearer ${token}`,
               'content-type': 'application/json'
            }
         });
         const data = await response.json();
         if (!response.ok) {
            return thunkApi.rejectWithValue(data);
         }
         return data;
      } catch (error) {
         console.log('Error happened while request for a specific user:', error.message);
         return thunkApi.rejectWithValue(data);
      }
   }
)

// SET THE PROFILE AVATAR:
export const setAvatarUrl = createAsyncThunk(
   'auth/setAvatarUrl',
   async (avatarUrl, thunkApi) => {
      try {
         const token = localStorage.getItem("accessToken");
         const response = await fetch(`${import.meta.env.VITE_BASE_SERVER_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
               'Authorization': `Bearer ${token}`,
               'content-type': 'application/json'
            },
            body: JSON.stringify(
               {
                  avatarUrl: avatarUrl
               }
            )
         })
         const data = await response.json();
         if (!response.ok) {
            return thunkApi.rejectWithValue(data);
         }
         return data;
      } catch (error) {
         console.log('Error while saving the avatar:', error.message)
         return thunkApi.rejectWithValue(error.message);
      }
   }
)

// GET LOGGED IN USER PROFILE:
export const getLoggedInUserData = createAsyncThunk(
   'auth/getLoggedUserData',
   async(_, thunkApi) => {
      try {
         const token = localStorage.getItem("accessToken");
         const response = await fetch(`${import.meta.env.VITE_BASE_SERVER_URL}/auth/loggedInUserData`, {
            method: 'GET',
            headers: {
               'Authorization': `Bearer ${token}`,
               'content-type': 'application/json'
            }
         })
         const data = await response.json();
         if(!response.ok) {
            return thunkApi.rejectWithValue(data);
         }
         return data;
      } catch (error) {
         console.log('Error occurred while getting the log in user data:', error.message);
         return thunkApi.rejectWithValue(error.message)
      }
   }
)

// TO CHANGE USERNAME AND USER AVATAR:
export const updateUsernameAndAvatar = createAsyncThunk(
   'auth/updateUsernameAndAvatar',
   async(userData, thunkApi) => {
      try {
         console.log(userData);
         const token = localStorage.getItem("accessToken");
         const response = await fetch(`${import.meta.env.VITE_BASE_SERVER_URL}/auth/settings`, {
            method: 'PUT',
            headers: {
               'Authorization': `Bearer ${token}`,
               'Content-type': 'application/json'
            },
            body: JSON.stringify(
               userData
            )
         })
         const data = await response.json();
         console.log(data);
         if(!response.ok) {
            return thunkApi.rejectWithValue(data);
         }
         return data;
      } catch (error) {
         console.log('Error occurred while changing username and avatar:', error.message);
         return thunkApi.rejectWithValue(error.message)
      }
   }
)

// DELETE USER FROM THE DB:
export const deleteLoginUser = createAsyncThunk(
   'auth/deleteUser',
   async(_, thunkApi) => {
      try {
         const token = localStorage.getItem("accessToken");
         const response = await fetch(`${import.meta.env.VITE_BASE_SERVER_URL}/auth`, {
            method: 'DELETE',
            headers: {
               'Authorization': `Bearer ${token}`,
               'Content-type': 'application/json'
            }
         });
         const data = await response.json();
         if(!response.ok) {
            return thunkApi.rejectWithValue({
               status: response.status,
               message: data.msg
            })
         }
         return data;
      } catch (error) {
         console.log('Error while requesting to delete the user:', error.message);
         return thunkApi.rejectWithValue(error.message);
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
            state.token = action.payload.token;
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
            state.allUsers = action.payload.allUsersExceptCurrent;
         })
         .addCase(getAllUsers.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
         })
         // AFTER GETTING SELECTED USER TO CHAT WITH DATA:
         .addCase(getUserToChatWithData.pending, (state) => {
            state.isLoading = true;
         })
         .addCase(getUserToChatWithData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.selectedUserToChatData = action.payload.chatUserData;
         })
         .addCase(getUserToChatWithData.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
         })
         // AFTER GETTING SELECTED GROUP TO CHAT IN DATA:
         .addCase(getSelectedGroupData.pending, (state) => {
            state.isLoading = true;
         })
         .addCase(getSelectedGroupData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.selectedGroupToChatData = action.payload.selectedGroupData;
         })
         .addCase(getSelectedGroupData.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
         })
         // AFTER GETTING AVATAR URL:
         .addCase(setAvatarUrl.pending, (state) => {
            state.isLoading = true;
         })
         .addCase(setAvatarUrl.fulfilled, (state, action) => {
            state.isLoading = false;
            state.userAvatar = action.payload;
         })
         .addCase(setAvatarUrl.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
         })
         // AFTER GETTING LOGGED IN USER DATA:
         .addCase(getLoggedInUserData.pending, (state) => {
            state.isLoading = true;
         })
         .addCase(getLoggedInUserData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.userAvatar = action.payload.userData;
            state.username = action.payload.userData.username;
         })
         .addCase(getLoggedInUserData.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
         })
         // AFTER GETTING LOGGED IN USER DATA:
         .addCase(updateUsernameAndAvatar.pending, (state) => {
            state.isLoading = true;
         })
         .addCase(updateUsernameAndAvatar.fulfilled, (state, action) => {
            state.isLoading = false;
            state.userAvatar = action.payload;
            state.username = action.payload.username;
         })
         .addCase(updateUsernameAndAvatar.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
         })
   }
})

const authReducer = authSlice.reducer;

export const { signOut, removePrevAvatar } = authSlice.actions;

export { authReducer }