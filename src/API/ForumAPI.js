import api from '../config/axiosConfig';


export const getMessageForum = async (id_forum) => {
    try {
        const body = {
            id_forum: id_forum
        };
        const response = await api.post(`/chat/forum`, body);
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

export const getForumByCours = async (id_chap) => {
    try {
        const body = {
            id_chapitre: id_chap
        };
        const response = await api.post(`/chat/forum-cours`, body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getForumByQuizz = async (id_quizz) => {
    try {
        const body = {
            id_quizz: id_quizz
        };
        const response = await api.post(`/chat/forum-quizz`, body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

