import { configureStore } from "@reduxjs/toolkit";
import { postsReducer } from "./slices/posts";
import { authReducer } from "./slices/auth";

const store = configureStore({
  reducer: {
    // Add your reducers here
    posts: postsReducer,
    auth: authReducer,
  },
});

export default store;
