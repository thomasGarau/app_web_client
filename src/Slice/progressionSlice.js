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
            console.log(state.progressions);
        },
        setProgression: (state, action) => {
            console.log('Updating progression:', action);           
            const { resourceId, clampedPercentage, index } = action.payload;
            console.log(state.progressions[index].progression);
            state.progressions[index].progression = clampedPercentage;

        }
    }
});

export const {
    setProgression,
    setAllProgressions
} = progressionSlice.actions;

export default progressionSlice.reducer;