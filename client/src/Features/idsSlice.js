import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   groupId: '',
   personalChatId: ''
}

const idsSlice = createSlice({
   name: 'ids',
   initialState,
   reducers: {
      getPersonalChatId: (state, action) => {
         state.personalChatId = action.payload;
         state.groupId = '';
      },
      getGroupId: (state, action) => {
         state.groupId = action.payload;
         state.personalChatId = '';
      },
      removeGroupId: (state, action) => {
         state.groupId = '';
      }
   }
})

const idsReducer = idsSlice.reducer;

export const { getPersonalChatId ,getGroupId, removeGroupId } = idsSlice.actions;

export { idsReducer }