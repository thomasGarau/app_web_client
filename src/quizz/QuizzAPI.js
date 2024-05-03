import api from '../config/axiosConfig';
import { getTokenAndRole } from '../services/Cookie.js';
import axios from 'axios';

export const getQuizzParChap = async (chap_id) => {
    try {
        const body = {
            chapitre: chap_id
        };
        const response = await api.post(`/quizz/quizzForChapter`, body);
        console.log("réponse : ",response);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getQuestionParQUizz = async (quizz_id) => {
    try {
        const body = {
            quizz: quizz_id
        };
        const response = await api.post(`/quizz/questionsPourQuizz`, body);
        console.log("réponse ques : ",response);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}




export const getReponsesPourQuestion = async (question_id) => {
    try {
        const body = {
            question: question_id
        };
        console.log(body)
        const response = await api.post(`/quizz/reponsesPourQuestion`, body);
        console.log("réponse reponse : ",response);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const handleSubmit = async (quizId, selectedAnswers) => {
    const payload = {
        quizz: quizId,
        data: selectedAnswers.map(idReponse => ({ idReponse }))
    };

    console.log('Soumission :', payload);

    try {
        const response = await api.post('/quizz/ajouterReponseUtilisateurAuQuizz', payload);
        console.log('Réponse de soumission:', response);
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
        console.log("body info : ",body);

        const response = await api.post(`/quizz/getQuizzInfo`);
        console.log("réponse info : ",response);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getQuizzInfos = async (noteQuizId) => {
    try {
        const body = {
            note_quizz: noteQuizId
        };
        console.log("body info : ",body);

        const response = await api.post(`/quizz/getNoteQuizzInfo`, body);
        console.log("réponse info : ",response);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getStatQuestions = async (noteQuizId) => {
    try {
        const body = {
            note_quizz: noteQuizId
        };
        console.log("body info : ",body);

        const response = await api.post(`/quizz/resultatUtilisateurQuizz`, body);
        console.log("réponse info : ",response);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getReponsesUtilisateurPourQuestion = async (question_id, quiz_id) => {
    try {
        const body = {
            question: question_id,
            quizz: quiz_id
        };
        //const response = await api.post(`/quizz/reponsesUtilisateurPourQuestion`, body);
        //console.log("réponse reponse : ",response);
        //return response.data;
    }
    catch (error) {
        throw error;
    }
}