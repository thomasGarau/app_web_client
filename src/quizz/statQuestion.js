import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getNoteQuizzInfo, getQuestionParQUizz, getReponsesPourQuestion } from './QuizzAPI';
import { useQuiz } from './QuizContext';

import "@fontsource/nanum-pen-script";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import './Question.css';
import StyledButton from '../composent/StyledBouton.js';
import { all } from 'axios';
import { Box, Typography } from '@mui/material';

function StatQuestion() {
    const navigate = useNavigate();
    const { quizId, noteQuizId, questionId } = useParams();
    const [listQuestions, setListQuestions] = useState([])
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [answerUser, setAnswerUser] = useState([]);
    const [infos, setInfos] = useState({})

    useEffect(() => {
        const fetchStatQuestions = async () => {
            try {
                const questions = await getNoteQuizzInfo(noteQuizId);
                const questionsBis = await getQuestionParQUizz(quizId);
                if (questions && questionsBis && questions.details.length > 0 && questionsBis.length > 0) {
                    const combinedQuestions = questions.details.map(question1 => {
                        const matchingQuestion2 = questionsBis.find(question2 => question2.id_question === question1.id_question);
                        return {
                            ...question1,
                            ...matchingQuestion2
                        };
                    });
                    setListQuestions(combinedQuestions);
                    setInfos(questions.resultat);
                    const current = combinedQuestions.find(q => q.id_question.toString() === questionId) || combinedQuestions[0];
                    setCurrentQuestion(current);
                    const answers = await getReponsesPourQuestion(current.id_question);
                    setCurrentQuestion(prev => ({ ...prev, answers: answers || [] }));
                    console.log(answers);
                } else {
                    setCurrentQuestion(null);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des questions:', error);
                setCurrentQuestion(null);
            }
        };
        fetchStatQuestions();
    }, [quizId, questionId, noteQuizId]);


    useEffect(() => {
        console.log(currentQuestion)
        console.log(listQuestions)
    }, [listQuestions, currentQuestion])

    const navigateToNextQuestion = () => {
        const currentIndex = listQuestions.findIndex(q => q.id_question.toString() === questionId);
        if (currentIndex !== -1 && currentIndex + 1 < listQuestions.length) {
            const nextQuestion = listQuestions[currentIndex + 1];
            navigate(`/statQuizz/${quizId}/${noteQuizId}/${nextQuestion.id_question}`);
        } else {
            navigate(`/statQuizz/${quizId}/${noteQuizId}`);
        }
    };

    const navigateToPreviousQuestion = () => {
        const currentIndex = listQuestions.findIndex(q => q.id_question.toString() === questionId);
        if (currentIndex > 0) { // Vérifier si c'est pas la première question
            const previousQuestion = listQuestions[currentIndex - 1];
            navigate(`/statQuizz/${quizId}/${noteQuizId}/${previousQuestion.id_question}`);
        } else {
            navigate(`/statQuizz/${quizId}/${noteQuizId}`);
        }
    };



    if (!currentQuestion || !currentQuestion.answers) return <div>Aucune question disponible</div>;

    return (
        <div className='background-question'>
            <div className='base_container_quizz_question'>
                <Typography sx={{ fontSize: { xs: "2em", sm: "2.5em", md: "3em" } }} className='quizz-title'>{infos.label || 'Titre non disponible'}</Typography>
                <div className='question-quest-container'>
                    <Typography sx={{ fontSize: { xs: "1em", sm: "1.5em", md: "2em" } }} className='Question_titre'>{currentQuestion.label || 'Texte de question non disponible'}</Typography>
                    <div className='reponse-container-stat'>
                        {currentQuestion.answers.length > 0 ? currentQuestion.answers.map((answer) => (
                            <Box key={answer.id_reponse} sx={{ width: "80%", display: "flex", alignItems: "center" }}>
                                <Typography
                                    sx={{
                                        fontSize: { xs: "0.8em", sm: "1.2em", md: "1.6em" },
                                        overflow: 'hidden',
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        marginRight: "10px"
                                    }}
                                    className={`reponse-stat ${answer.est_bonne_reponse === 1 && currentQuestion.reponsesUtilisateur.every(
                                        (value, index) => value === currentQuestion.bonnesReponses[index]
                                    ) ?
                                        'user-correct' : answer.est_bonne_reponse === 0 && !currentQuestion.reponsesUtilisateur.every(
                                            (value, index) => value === currentQuestion.bonnesReponses[index]
                                        ) ? 'user-wrong' : ""}`}
                                >
                                    {answer.contenu}
                                </Typography>
                                {answer.est_bonne_reponse === 1 ?
                                    <CheckIcon fontSize='large' sx={{ color: "#4CAF50", position: "relative" }} /> :
                                    <CloseIcon fontSize='large' sx={{ color: "#f44336", position: "relative" }} />}
                            </Box>


                        )) : <p>Pas de réponses disponibles</p>}
                    </div>
                </div>
                <div className='button-container'>
                    <StyledButton onClick={navigateToPreviousQuestion} color={"secondary"} content={"Retour"} className='btn_retour button-connection'></StyledButton>
                    <StyledButton onClick={navigateToNextQuestion} color={"primary"} content={"Suivant"} className='btn_valider button-connection'></StyledButton>
                </div>
            </div>
        </div>

    );
}

export default StatQuestion;
