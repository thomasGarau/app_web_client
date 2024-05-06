import api from '../config/axiosConfig';
import { getTokenAndRole } from '../services/Cookie.js';


export const getCoursParChap = async (chap_id) => {
    try {
        const body = {
            id_chapitre: chap_id
        };
        console.log(body);
        const response = await api.post(`/cours/allcours-chapitre`, body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getChapitre = async (chap_id) => {
    try {
        const body = {
            id_chapitre: chap_id
        };
        const response = await api.post(`/chapitre/chapitre`, body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const recolteInteraction = async (currentCour, chap_id, clic, dureeSession, scroll, progression) => {
    try {
        const body = {
            cours: currentCour,
            id_chapitre: chap_id,
            dureeSession: dureeSession,
            clics: clic,
            scrolls: scroll,
            progression: progression
        };
        console.log(body);
        const response = await api.post(`/jMethode/recolteInteraction`, body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}