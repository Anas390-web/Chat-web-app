import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./src/Features/authSlice.js";
import { contactListReducer } from "./src/Features/contactsSlice.js";
import messagesReducer from "./src/Features/messagesSlice.js";
import { groupListReducer } from "./src/Features/groupListSlice.js";
import { idsReducer } from "./src/Features/idsSlice.js";

const store = configureStore({
   reducer: {
      auth: authReducer,
      contacts: contactListReducer,
      messages: messagesReducer,
      groups: groupListReducer,
      ids: idsReducer
   }
})

export default store;