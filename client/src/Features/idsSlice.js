import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   groupId: ''
}

const idsSlice = createSlice({
   name: 'ids',
   initialState,
   reducers: {
      getGroupId: (state, action) => {
         state.groupId = action.payload;
      }
   }
})

const idsReducer = idsSlice.reducer;

export const { getGroupId } = idsSlice.actions;

export { idsReducer }