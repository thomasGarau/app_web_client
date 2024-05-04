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

export const getUserInfo = async () => {
    const body = {

    }
    try {
        const response = await api.get(`/user/getUserInfo`, body);
        console.log("réponse : ",response);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

