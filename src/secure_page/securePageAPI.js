import api from '../config/axiosConfig';

export const getUe = async () => { 
    try {
        const response = await api.get('/ue/ue-user');
        console.log(response.data);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}