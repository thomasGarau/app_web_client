import api from '../config/axiosConfig';


export const getCoursParChap = async (chap_id) => {
    try {
        const body = {
            id_chapitre: chap_id
        };
        const response = await api.post(`/cours/allcours-chapitre`, body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}