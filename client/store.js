import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./src/Features/authSlice.js";
import { contactListReducer } from "./src/Features/contactsSlice.js";
import messagesReducer from "./src/Features/messagesSlice.js";

const store = configureStore({
   reducer: {
      auth: authReducer,
      contacts: contactListReducer,
      messages: messagesReducer
   }
})

export default store;