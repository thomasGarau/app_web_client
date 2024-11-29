import api from '../config/axiosConfig';


export const getAnnotationsCours = async (id_cours) => {

    try {
        const body = {
            cours: id_cours
        };

        const response = await api.post('/annotation/annotation-cours', body);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getAnnotationsQuiz = async (id_quiz) => {
    try {
        const body = {
            quizz: id_quiz
        };
        const response = await api.post('/annotation/annotation-quizz', body);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const createAnnotationCours = async (id_cours, contenu) => {
    try {
        const body = {
            cours : id_cours,
            annotation:{
                etat: "ouvert",
                contenu: contenu
            }          
        };
        const response = await api.post('/annotation/create-annotation-cours', body);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createAnnotationQuiz = async (id_question, contenu) => {
    try {
        const body = {
            question : id_question,
            annotation:{
                etat: "ouvert",
                contenu: contenu
            }          
        };
        const response = await api.post('/annotation/create-annotation-quizz', body);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateAnnotation = async (annotationId, contenu) => {
    try {
        const body = {
            annotation: annotationId,
            contenu: contenu
        };
        const response = await api.put('/annotation/update-annotation-content', body);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateAnnotationResponse = async (reponseId, contenu) => {
    try {
        const body = {
            reponse: reponseId,
            contenu: contenu
        };
        const response = await api.put('/annotation/update-answer', body);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createAnnotationResponse = async (annotationId, contenu) => {
    try {
        const body = {
            annotation: annotationId,
            contenu: contenu
        };        
        const response = await api.post('/annotation/add-answer', body);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getAnnotationResponses = async (annotationId) => {
    try {
        const body = {
            annotation: annotationId,
        };
        
        const response = await api.post('/annotation/annotation-answer', body);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const removeAnnotation = async (annotationId) => {
    try {
        const response = await api.delete('/annotation/delete-annotation', {
            data: {
                annotation: annotationId
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const removeAnnotationResponse = async (reponseId) => {
    try {
        const response = await api.delete('/annotation/delete-answer', {
            data: {
                reponse: reponseId
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateAnnotationState = async (annotationId, etat) => {
    try {
        const body = {
            annotation: annotationId,
            etat: etat
        };
        const response = await api.put('/annotation/update-annotation-state', body);
        return response.data;
    } catch (error) {
        throw error;
    }
}   