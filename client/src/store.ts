import { configureStore } from "@reduxjs/toolkit";
import { createStore } from "redux";
import rootReducer from "./reducer";
import breweryReducer from "./slices/brewerySlice";

//const store = createStore(rootReducer);
export const store = configureStore({
  reducer: {
    brewery: breweryReducer,
  },
});

//export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
