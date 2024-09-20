import { configureStore } from '@reduxjs/toolkit';
import forumReducer from '../Slice/forumSlice';

export const store = configureStore({
  reducer: {
    forum: forumReducer
  }
});
