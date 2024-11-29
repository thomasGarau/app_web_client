import { createSlice } from '@reduxjs/toolkit';

const flashcardsSlice = createSlice({
  name: 'flashcards',
  initialState: {
    flashcards: [],
    currentFlashcard: null,
    modalState: {
      isModalOpen: false,
      isEditing: false,
      isAnswering: false,
    },
  },
  reducers: {
    setFlashcards: (state, action) => {
      state.flashcards = action.payload;
    },
    setCurrentFlashcard: (state, action) => {
      state.currentFlashcard = action.payload;
    },
    setModalTrue: (state, action) => {
      state.modalState.isAnswering = action.payload.isAnswering;
      state.modalState.isEditing = action.payload.isEditing;
      state.modalState.isModalOpen = true;
    },
    setModalFalse: (state) => {
      state.modalState.isAnswering = false;
      state.modalState.isEditing = false;
      state.modalState.isModalOpen = false;
    },
    setCurrentQuestion: (state, action) => {
      state.currentFlashcard.question = action.payload;
    },
    setCurrentReponse: (state, action) => {
      console.log('Setting reponse:', action.payload);
      console.log('Current flashcard:', state);
      state.currentFlashcard.reponse = action.payload;
    }
  }
});

export const {
  setFlashcards,
  setCurrentFlashcard,
  setModalTrue,
  setModalFalse,
  setCurrentQuestion,
  setCurrentReponse } = flashcardsSlice.actions;
export default flashcardsSlice.reducer;
