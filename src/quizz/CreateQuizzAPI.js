import api from '../config/axiosConfig';

export const createQuizz = async (label, type, chapitre, questions) => {
    try {
        const body = {
            label: label,
            chapitre: chapitre,
            type: type,
            questions: questions
        };
        const response = await api.post('/quizz/ajouterQuizz', body);
        console.log("réponse : ",response.data);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getChapitreUE = async (id_ue) => {
    try {
        const body = {
            id_ue: id_ue,
        };
        const response = await api.post('/ue/allchapitre-ue', body);
        console.log("réponse : ",response.data);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}
