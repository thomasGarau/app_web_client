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