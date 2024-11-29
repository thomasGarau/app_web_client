import { getUserFlashcards } from "../API/FlashcardsAPI";
import { setFlashcards, setCurrentFlashcard, setModalTrue, setModalFalse } from "../Slice/flashcardsSlice";

export const handleFlipCard = (index, setFlashCards) => {
    setFlashCards((prevList) =>
        prevList.map((card, i) =>
            i === index ? { ...card, isFlipped: !card.isFlipped } : card
        )
    );
};

export const handleCloseModal = (dispatch) => {
    dispatch(setCurrentFlashcard(null));
    dispatch(setModalFalse());
};

export const handleOpenModal = (flashcard, isAnswering, isEditing, dispatch) => {
    console.log(flashcard)
    dispatch(setCurrentFlashcard(flashcard));
    dispatch(setModalTrue({ isAnswering, isEditing }));
};

export const fetchMyCollection = async (id_chap, dispatch) => {
    console.log('Fetching flashcards for chapter:', id_chap);
    try {
        const response = await getUserFlashcards(id_chap);
        const processedFlashcards = response.map(flashcard => {
            if (flashcard.visibilite === 'orphelin') {
                return { ...flashcard, orphan: true };
            }
            return flashcard;
        });

        dispatch(setFlashcards(processedFlashcards));
    } catch (error) {
        console.error('Fetch error:', error);
    }
};
