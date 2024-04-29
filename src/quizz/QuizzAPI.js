import api from '../config/axiosConfig';

export const getQuizzParChap = async (chap_id) => {
    try {
        const body = {
            chapitre: 1
        };
        const response = await api.get('/quizz/quizzForChapter', body);
        console.log("réponse : ",response.data);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}