import api from '../config/axiosConfig';
import { getTokenAndRole } from '../services/Cookie.js';


export const getForumByCours = async (id_chap) => {
    try {
        const body = {
            id_chapitre: id_chap
        };
        console.log("body : ", body);
        const response = await api.post(`/chat/forum-cours`, body);
        console.log("response forum : ", response.data);
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
        console.log("response forum : ", response.data);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}



export const EnvoyerNoteQuizz = async (quizId, note) => {
    try{
        const body = {
            quizz: quizId,
            note: note
        };
        const response = await api.post(`/quizz/ajouterNoteUtilisateurPourQuizz`, body);
        console.log("réponse note envoyé ",response);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getLastNoteQuizz = async (quizId) => {
    try {
        const body = {
            quizz: quizId
        };
        const response = await api.post(`/quizz/getNoteUtilisateurDonneeAuQuizz`, body);
        console.log("response note dernière : ", response.data);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

