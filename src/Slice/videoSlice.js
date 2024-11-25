import { createSlice } from '@reduxjs/toolkit';
import { setProgression } from './progressionSlice';

const videoSlice = createSlice({
    name: 'video',
    initialState: {
        pause: 0,
        time: 0,
        progression: 0
    },
    reducers: {
        incrementerPause: (state, action) => {
            state.pause += 1
        },
        setTime: (state, action) => {
            state.time = action.payload;
        },
        setPause: (state, action) => {
            state.pause = action.payload;
        },
        setProgressionVideo: (state, action) => {
            state.progression = action.payload
        }
    }
})

export const { incrementerPause, setTime, setPause, setProgressionVideo } = videoSlice.actions;
export default videoSlice.reducer;