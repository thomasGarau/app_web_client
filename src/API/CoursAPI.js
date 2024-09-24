import api from '../config/axiosConfig.js';


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

export const getChapitreById = async (chapitreId) => {
    const body = {
        id_chapitre: chapitreId
    }
    try {
        const response = await api.post(`/cours/getChapitreById`, body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}



export const editCours = async (id, label, contenu) => {
    try {
        const body = {
            id_study: id,
            label: label,
            contenu: contenu
        };
        console.log(body);
        const response = await api.post(`/cours/update-cours`, body);
        console.log(response);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const deleteCours = async (id) => {
    try {
        const body = {
            id_study: id
        };
        const response = await api.post(`/cours/delete-cours`, body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const addCours = async ( label, contenu, id_chapitre) => {
    try {
        const body = {
            label: label,
            contenu: contenu,
            id_chapitre: id_chapitre
        };
        const response = await api.post(`/cours/add-cours`, body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

