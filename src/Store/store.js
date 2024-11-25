import { configureStore } from '@reduxjs/toolkit';
import forumReducer from '../Slice/forumSlice';
import videoReducer from '../Slice/videoSlice';
import annotationSlice from '../Slice/annotationSlice';
import progressionSlice from '../Slice/progressionSlice';

export const store = configureStore({
  reducer: {
    forum: forumReducer,
    progression: progressionSlice,
    video: videoReducer,
    annotation: annotationSlice,
  }
});
