import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getQuestionParQUizz, getReponsesPourQuestion } from './QuizzAPI';
import { useQuiz } from './QuizContext';

import "@fontsource/nanum-pen-script";
import Header from '../composent/Header.js';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import './Question.css';
import StyledButton from '../composent/StyledBouton.js';
import { all } from 'axios';

function StatQuestion() {
    const navigate = useNavigate();
    const { quizId, questionId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [answerUser, setAnswerUser] = useState([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const data = await getQuestionParQUizz(parseInt(quizId));
                console.log(data)
                if (data && data.length > 0) {
                    setQuestions(data);

                    const current = data.find(q => q.id_question.toString() === questionId) || data[0];
                    setCurrentQuestion(current);
                    const answers = await getReponsesPourQuestion(current.id_question);
                    setCurrentQuestion(prev => ({ ...prev, answers: answers || [] })); // Assurez-vous de définir un tableau vide si aucune réponse n'est trouvée
                } else {
                    // Définir currentQuestion comme null ou comme objet vide pour indiquer qu'il n'y a pas de questions
                    setCurrentQuestion(null);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des questions :", error);
                setCurrentQuestion(null);
            }
        };

        fetchQuestions();
    }, [quizId, questionId]);


    const navigateToNextQuestion = () => {
        const currentIndex = questions.findIndex(q => q.id_question.toString() === questionId);
        if (currentIndex !== -1 && currentIndex + 1 < questions.length) {
            const nextQuestion = questions[currentIndex + 1];
            navigate(`/statQuizz/${quizId}/${nextQuestion.id_question}`);
        } else {
            navigate(`/quiz-completed/${quizId}`);
        }
    };

    const navigateToPreviousQuestion = () => {
        const currentIndex = questions.findIndex(q => q.id_question.toString() === questionId);
        if (currentIndex > 0) { // Vérifier si c'est pas la première question
            const previousQuestion = questions[currentIndex - 1];
            navigate(`/statQuizz/${quizId}/${previousQuestion.id_question}`);
        } else {
            navigate(`/statQuizz/${quizId}`);
        }
    };



    if (!currentQuestion || !currentQuestion.answers) return <div>Aucune question disponible</div>;

    return (
        <div className='background-question'>
            <div className='base_container_quizz_question'>
                <h1 className='quizz-title'>{currentQuestion.title || 'Titre non disponible'}</h1>
                <div className='question-quest-container'>
                    <h3 className='Question_titre'>{currentQuestion.label || 'Texte de question non disponible'}</h3>
                    <div className='reponse-container'>
                        {currentQuestion.answers.length > 0 ? currentQuestion.answers.map((answer) => (
                            <button key={answer.id_reponse}
                                className={`reponse-stat ${answer.est_bonne_reponse === 1 && answerUser.includes(answer.id_reponse) ?
                                    'user-correct' : answer.est_bonne_reponse === 1 && !answerUser.includes(answer.id_reponse) ? 'user-wrong' : ""}`}
                            >
                                {answer.contenu}{answer.est_bonne_reponse === 1 ?
                                    <CheckIcon fontSize='large' sx={{ color: "#4CAF50" }} /> :
                                    <CloseIcon fontSize='large' sx={{ color: "#f44336" }} />}
                            </button>
                        )) : <p>Pas de réponses disponibles</p>}
                    </div>
                </div>
                <div className='button-container'>
                    <StyledButton onClick={navigateToPreviousQuestion} color={"secondary"} content={"Retour"} className='btn_retour button-connection'></StyledButton>
                    <StyledButton onClick={navigateToNextQuestion} color={"primary"} content={"Valider"} className='btn_valider button-connection'></StyledButton>
                </div>
            </div>
        </div>

    );
}

export default StatQuestion;
