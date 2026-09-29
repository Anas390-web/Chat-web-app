import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {
   groupList: [],
   isLoading: true,
   error: ''
}

// FETCH THE GROUP LIST TO DISPLAY ON DASHBOARD:
export const creatAGroup = createAsyncThunk(
   'groupList/creatAGroup',
   async(groupDetails, thunkApi) => {
      try {
         const token = localStorage.getItem("accessToken");
         console.log(groupDetails);
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



const groupListSlice = createSlice({
   name: 'groupList',
   initialState,
   reducers: {

   },
   extraReducers: (builder) => {

   }
})

const groupListReducer = groupListSlice.reducer;

export {groupListReducer}