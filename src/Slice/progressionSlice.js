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
            const { resourceId, clampedPercentage, index } = action.payload;
            // S'assurer que la nouvelle valeur est supérieure à l'ancienne
            const currentProgress = state.progressions[index]?.progression || 0;
            state.progressions[index].progression = Math.max(currentProgress, clampedPercentage);

        }
    }
});

export const {
    setProgression,
    setAllProgressions
} = progressionSlice.actions;

export default progressionSlice.reducer;