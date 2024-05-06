import api from '../config/axiosConfig';

export const getUe = async () => {
    try {
        const response = await api.get('/ue/ue-user');
        
        console.log("ue et prof : ", response);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getJMethod = async () => {
    try {
        // const response = await api.get('/ue/ue-user');
        const response = [
            {
                label: "nom de la matière",
                date: "2024-04-30",
                duree: 80
            },
            {
                label: "nom de la matièrehihi",
                date: "2024-05-01",
                duree: 60
            }

        ]
        return response;
    }
    catch (error) {
        throw error;
    }
}

export const getUeProf = async () => {
    try {
        const response = await api.get('/ue/ue-enseignant');
        console.log("ue de prof : ", response);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}


