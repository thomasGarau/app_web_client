import { createSlice } from '@reduxjs/toolkit';

const pdfViewerSlice = createSlice({
    name: 'pdfViewer',
    initialState: {
        scroll: 0,
        progression: 0,
    },
    reducers: {
        incrementerScroll: (state, action) => {
            state.scroll += 1
        },
        setProgression: (state, action) => {
            state.progression = action.payload;
        },
        setScroll: (state, action) => {
            state.scroll = action.payload;
        }
    }
})

export const { incrementerScroll, setProgression, setScroll } = pdfViewerSlice.actions;
export default pdfViewerSlice.reducer;