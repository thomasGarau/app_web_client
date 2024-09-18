import api from '../config/axiosConfig.js';
import { getTokenAndRole } from '../services/Cookie.js';

export const getChapParUE = async (ue_id) => {
    try {
        const body = {
            id_ue: ue_id
        };
        
        const response = await api.post(`/ue/allchapitre-ue`, body);
        return response.data;
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


export const getUe = async () => {
    try {
        const response = await api.get('/ue/ue-user');
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
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const addChapitre = async (label, ue_id) => {
    try {
        const body = {
            label: label,
            id_ue: ue_id
        };
        const response = await api.post(`/ue/add-chapitre`, body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const updateChapitre = async (id, label) => {
    try {
        const body = {
            id_chapitre: id,
            label: label
        };
        const response = await api.post(`/ue/update-chapitre`, body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const deleteChapitre = async (id) => {
    try {
        const body = {
            id_chapitre: id
        };
        const response = await api.post(`/ue/delete-chapitre`, body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}