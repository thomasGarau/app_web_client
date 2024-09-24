import { configureStore } from '@reduxjs/toolkit';
import forumReducer from '../Slice/forumSlice';
import pdfViewerReducer from '../Slice/pdfViewerSlice';

export const store = configureStore({
  reducer: {
    forum: forumReducer,
    pdfViewer: pdfViewerReducer,
  }
});
