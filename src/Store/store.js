import { configureStore } from '@reduxjs/toolkit';
import forumReducer from '../Slice/forumSlice';
import pdfViewerReducer from '../Slice/pdfViewerSlice';
import videoReducer from '../Slice/videoSlice';
import annotationSlice from '../Slice/annotationSlice';

export const store = configureStore({
  reducer: {
    forum: forumReducer,
    pdfViewer: pdfViewerReducer,
    video: videoReducer,
    annotation: annotationSlice,
  }
});
