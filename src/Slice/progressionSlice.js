import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    progressions: []
};

const progressionSlice = createSlice({
    name: 'progression',
    initialState,
    reducers: {
        setAllProgressions: (state, action) => {
            state.progressions = action.payload;
        },
        setProgression: (state, action) => {           
            const { resourceId, clampedPercentage, index } = action.payload;
            state.progressions[index].progression = clampedPercentage;

        }
    }
});

export const {
    setProgression,
    setAllProgressions
} = progressionSlice.actions;

export default progressionSlice.reducer;