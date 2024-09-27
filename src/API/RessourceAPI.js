import api from '../config/axiosConfig.js';


export const getRessourceParChap = async (chap_id) => {
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

export const getRessourceById = async (res_id) => {
    try {
        const body = {
            id_study: res_id
        };
        const response = await api.post(`/cours/cours-id`, body, {
            responseType: 'blob', 
        });
        return response.data; 
    }
    catch (error) {
        console.error("Erreur lors de la récupération de la ressource :", error);
        throw error;
    }
};

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



export const editRessource = async (id, label, contenu) => {
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

export const deleteRessourceApi = async (id) => {
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

export const addCoursProgression = async (id, prog) => {
    try {
        const body = {
            id_study: id,
            progression: prog
        };
        const response = await api.post(`/cours/add-cours-progression`, body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const addRessource = async (file, label, id_chapitre) => {
    try {
        const formData = new FormData();
        formData.append('file', file); // Ajout du fichier
        formData.append('label', label); // Ajout du label
        formData.append('chapitre', id_chapitre); // Ajout de l'id du chapitre

        const response = await api.post(`/cours/add-cours`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};


