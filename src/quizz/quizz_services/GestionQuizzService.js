import { getChapitreById } from "../../API/RessourceAPI";
import { getUserInfo } from "../../API/ProfileAPI";
import { deleteQuizz, getListQuizzCreateForUser, getQuizzParChap } from "../../API/QuizzAPI";


export const delQuizz = async (quizId, handleFetchMyQuizz) => {
    try {
        await deleteQuizz(quizId);
        handleFetchMyQuizz();
    } catch (error) {
        console.error('Erreur lors de la suppression du quizz:', error);
    }
};

export const fetchMyQuizz = async (setQuizzes, setListUE, setIdUe = null, id = null) => {
    try {
        if (id) {
            const quizzsResponse = await getQuizzParChap(id);
            setQuizzes(quizzsResponse[0]);
            const responseInfo = await getChapitreById(id);
            setIdUe(responseInfo[0].id_ue);
        } else {
            const quizzs = await getListQuizzCreateForUser();
            const enhancedQuizzs = await Promise.all(quizzs.map(async (quizz) => {
                const chapitreInfo = await getChapitreById(quizz.id_chapitre);
                const note_moyenne = parseFloat(quizz.moyenne_note).toFixed(1);
                return { ...quizz, chapitreInfo, note: note_moyenne };
            }));
            setQuizzes(enhancedQuizzs);
            const response_info = await getUserInfo();
            setListUE(response_info.ue);
        }

    } catch (error) {
        console.error('Erreur lors de la récupération des quizz:', error);
    }
};