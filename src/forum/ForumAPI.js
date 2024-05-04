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

export const getMessageForum = async (id_forum) => {
    try {
        const body = {
            id_forum: id_forum
        };
        const response = await api.post(`/chat/forum`, body);
        console.log("message : ",response.data);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const ajouterMessageForum = async (id_forum, contenu) => {
    try {
        const body = {
            contenu: contenu,
            id_forum: id_forum
        };
        console.log("body : ",body);
        const response = await api.post(`/chat/add-message`, body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const cloturerForum = async (id_forum) => {
    try {
        const body = {
            id_forum: id_forum
        };
        //const response = await api.post(`/chat/close-forum`, body);
        const response = "ok"
        return response;
    }
    catch (error) {
        throw error;
    }
}

