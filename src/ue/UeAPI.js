import api from '../config/axiosConfig';
import { getTokenAndRole } from '../services/Cookie.js';

export const getChapParUE = async (ue_id) => {
    try {
        const body = {
            id_ue: ue_id
        };
        
        const response = await api.post(`/ue/allchapitre-ue`, body);
        console.log('Réponse de getChapParUE:', response.data);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const ueInfo = async (ue_id) => {
    try {
        const body = {
            id_ue: ue_id
        };
        
        const response = await api.post(`/ue/ueInfo`, body);
        console.log('Réponse de ueInfo:', response.data);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}
