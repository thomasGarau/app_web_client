import api from '../config/axiosConfig';

export const getUe = async () => {
    try {
        const response = await api.get('/ue/ue-user');
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getJMethod = async () => {
    try {
        const response = await api.post('/jMethode/getCalendrier');
        return response;
    }
    catch (error) {
        throw error;
    }
}

export const getUeProf = async () => {
    try {
        const response = await api.get('/ue/ue-enseignant');
        return response.data;
    }
    catch (error) {
        throw error;
    }
}


