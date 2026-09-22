import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./src/Features/authSlice.js";
import { contactListReducer } from "./src/Features/contactsSlice.js";

const store = configureStore({
   reducer: {
      auth: authReducer,
      contacts: contactListReducer
   }
})

export default store;