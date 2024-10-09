import { createSlice } from '@reduxjs/toolkit';

const forumSlice = createSlice({
  name: 'forum',
  initialState: {
    showForum: false,
    forumId: ''
  },
  reducers: {
    showForum: (state, action) => {
      state.showForum = true;
      state.forumId = action.payload;
    },
    hideForum: (state) => {
      state.showForum = false;
      state.forumId = '';
    }
  }
});

export const { showForum, hideForum } = forumSlice.actions;
export default forumSlice.reducer;
