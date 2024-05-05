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
        console.log("response", response.data);
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
        const response = await api.post(`/chat/add-message`, body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const closeForum = async (id_forum) => {
    try {
        const body = {
            id_forum: id_forum
        };
        const response = await api.post(`/chat/forum-close`, body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getQuizzInfo = async (quizId) => {
    try {
        const body = {
            quizz: quizId
        };

        const response = await api.post(`/quizz/getQuizzInfo`, body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const addForumCours = async (label, contenu, id_cours) => {
    try {
        const body = {
            label: label,
            id_cours: id_cours,
            contenu: contenu
            
        };
        const response = await api.post(`/chat/add-forum-cours`, body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const addForumQuizz = async (label, contenu, id_quizz) => {
    try {
        const body = {
            label: label,
            id_quizz: id_quizz,
            contenu: contenu
            
        };
        const response = await api.post(`/chat/add-forum-quizz`, body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

