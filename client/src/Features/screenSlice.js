import { createSlice } from '@reduxjs/toolkit'


const initialState = {
   isMobileScreen: window.innerWidth <= 639
}


const screenSlice = createSlice({
   name: 'screen',
   initialState,
   reducers: {
      handleScreen : (state, action) => {
         state.isMobileScreen = action.payload;
      }
   }
})

const screenReducer = screenSlice.reducer;

export const {handleScreen} = screenSlice.actions;

export default screenReducer;