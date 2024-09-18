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
            cours: currentCour,
            chapitre: chap_id,
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




