import { configureStore } from '@reduxjs/toolkit';
import forumReducer from '../Slice/forumSlice';
import pdfViewerReducer from '../Slice/pdfViewerSlice';
import videoReducer from '../Slice/videoSlice';

export const store = configureStore({
  reducer: {
    forum: forumReducer,
    pdfViewer: pdfViewerReducer,
    video: videoReducer
  }
});
