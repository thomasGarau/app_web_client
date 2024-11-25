import api from '../config/axiosConfig';

export const getUserFlashcards = async (id_chapitre) => {
    try {
        const body = {
            chapitre: id_chapitre
        };
        const response = await api.post('/flashcard/user-flashcards', body);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getAllFlashcards = async (id_chapitre) => {
    try {
        const body = {
            chapitre: id_chapitre
        };
        const response = await api.post('/flashcard/all-flashcards', body);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createFlashcard = async (id_chapitre, question, reponse, visibilite) => {
    try {
        const body = {
            chapitre: id_chapitre,
            question: question,
            reponse: reponse,
            visibilite: visibilite
        };
        console.log(body);
        const response = await api.post('/flashcard/create-flashcard', body);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addFlashCardToCollection = async (id_flashcard) => {
    try {
        const body = {
            flashcard: id_flashcard,
        };
        const response = await api.post('/flashcard/add-flashcard-to-collection', body);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const removeFlashCardToCollection = async (id_flashcard) => {
    try {
        const response = await api.delete('/flashcard/remove-flashcard-from-collection', {
            data: { flashcard: id_flashcard }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteFlashcard = async (id_flashcard) => {
    try {
        const response = await api.delete('/flashcard/delete-flashcard', {
            data: { flashcard: id_flashcard }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateFlashcard = async (id_flashcard, question, reponse) => {
    console.log(id_flashcard, question, reponse);
    try {
        const body = {
            flashcard: id_flashcard,
            question: question,
            reponse: reponse,
        };
        const response = await api.put('/flashcard/update-flashcard', body);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getDailyFlashcard = async () => {
    try {
        const response = await api.post('/flashcard/daily-flashcards');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const flashcardAnswer = async (id_flashcard, answer) => {
    try {
        const body = {
            flashcard: id_flashcard,
            answer: answer,
        };
        const response = await api.post('/flashcard/flashcard-answer', body);
        return response.data;
    } catch (error) {
        throw error;
    }
}