import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {
   allGroupsList: [],
   specificGroup: {},
   isLoading: true,
   error: ''
}

// FETCH THE GROUP LIST TO DISPLAY ON DASHBOARD:
export const creatAGroup = createAsyncThunk(
   'groupList/creatAGroup',
   async(groupDetails, thunkApi) => {
      try {
         const token = localStorage.getItem("accessToken");
         const response = await fetch(`${import.meta.env.VITE_BASE_SERVER_URL}/groups`, {
            method: 'POST',
            headers: {
               'Authorization': `Bearer ${token}`,
               'Content-type': 'application/json'
            },
            body: JSON.stringify(
               groupDetails
            )
         })
         const data = await response.json();
         console.log('Data:' ,data);
         if(!response.ok){
            return thunkApi.rejectWithValue(data);
         }
         return data;
      } catch (error) {
         console.log(error.message);
         return thunkApi.rejectWithValue(error.message);
      }
   }
)

// FETCH THE ALL THE GROUPS THAT ARE CREATED:
export const allGroups = createAsyncThunk(
   'groupList/allGroups',
   async(_, thunkApi) => {
      try {
         const token = localStorage.getItem("accessToken");
         const response = await fetch(`${import.meta.env.VITE_BASE_SERVER_URL}/groups`, {
            method: 'GET',
            headers: {
               'Authorization': `Bearer ${token}`,
               'content-type': 'application/json'
            }
         });
         const data = await response.json();
         if(!response.ok){
            console.log('Error:', data);
            return thunkApi.rejectWithValue(data);
         }
         return data;
      } catch (error) {
         console.log(error.message);
         return thunkApi.rejectWithValue(error.message);
      }
   }
)

const groupListSlice = createSlice({
   name: 'groupList',
   initialState,
   reducers: {

   },
   extraReducers: (builder) => {
      builder
      // FOR ALL GROUPS:
         .addCase(allGroups.pending, (state) => {
            state.isLoading = true
         })
         .addCase(allGroups.fulfilled, (state, action) => {
            state.allGroupsList = action.payload.groups;
            state.isLoading = false
         })
         .addCase(allGroups.rejected, (state, action) => {
            state.isLoading = false,
            state.error = action.payload
         })
   }
})

const groupListReducer = groupListSlice.reducer;

export {groupListReducer}