import api from '../config/axiosConfig';

export const addUser = async (file) => {

    try {
        const response = await api.post(`/administration/ajouter-utilisateur`, file);
        console.log("réponse : ", response);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const addFormation = async (file) => {

    try {
        const response = await api.post(`/administration/ajouter-formation`, file);
        console.log("réponse : ", response);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}