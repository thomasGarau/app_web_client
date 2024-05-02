import api from '../config/axiosConfig';

export const getCurrentUser = async () => {
    
}

export const getListQuizzStatForUser = async () => {
    const body = {

    }
    try {
        const response = await api.get(`/quizz/listQuizzPasser`, body);
        console.log("réponse : ",response);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getListQuizzCreateForUser = async () => {
    const body = {

    }
    try {
        const response = await api.get(`/quizz/listQuizzCreer`, body);
        console.log("réponse : ",response);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}