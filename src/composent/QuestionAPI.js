import api from '../config/axiosConfig';
import { getTokenAndRole } from '../services/Cookie.js';


export const getForumByCours = async (cours_id) => {
    try {
        const body = {
            id_cours: cours_id
        };
        const response = await api.post(`/chat/forum-cours`, body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}
