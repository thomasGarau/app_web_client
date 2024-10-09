import api from '../config/axiosConfig';



export const getJMethod = async () => {
    try {
        const response = await api.post('/jMethode/getCalendrier');
        return response.data;
    }
    catch (error) {
        throw error;
    }
}


export const recolteInteraction = async (currentCour, chap_id, clic, dureeSession, scroll, progression) => {
    try {
        const body = {
            chapitre: chap_id,
            cours: currentCour,
            dureeSession: dureeSession,
            clics: clic,
            scrolls: scroll,
            progression: progression
        };
        const response = await api.post(`/jMethode/recolteInteraction`, body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}




