import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getQuestionParQUizz, getReponsesPourQuestion, getQuizzInfo } from '../API/QuizzAPI';
import { useQuiz } from './QuizContext';
import { Box, FormControl, InputLabel, MenuItem, Modal, Popover, Select, Typography, Button } from '@mui/material';

import "@fontsource/nanum-pen-script";

import './Question.css';
import StyledButton from '../composent/StyledBouton.js';
import { all } from 'axios';

function Question() {
    const navigate = useNavigate();
    const { handleSelectAnswer, allSelectedAnswers } = useQuiz();
    const { quizId, questionId } = useParams(); // Ajouter questionId pour gérer la question actuelle
    const [questionType, setQuestionType] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [quizzInfo , setQuizzInfo] = useState('');

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const data = await getQuestionParQUizz(quizId);
                if (data && data.length > 0) {
                    setQuestions(data);
                    const current = data.find(q => q.id_question.toString() === questionId) || data[0];
                    setCurrentQuestion(current);
                    setQuestionType(current.type || 'seul'); // Fournir une valeur par défaut pour type
                    const answers = await getReponsesPourQuestion(current.id_question);
                    setCurrentQuestion(prev => ({ ...prev, answers: answers || [] })); 
                    const quizzInfo2 = await getQuizzInfo(quizId);
                    setQuizzInfo(quizzInfo2);
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
            navigate(`/quiz/${quizId}/question/${nextQuestion.id_question}`);
        } else {
            navigate(`/quiz-completed/${quizId}`);
        }
    };

    const navigateToPreviousQuestion = () => {
        const currentIndex = questions.findIndex(q => q.id_question.toString() === questionId);
        if (currentIndex > 0) { // Vérifier si c'est pas la première question
            const previousQuestion = questions[currentIndex - 1];
            navigate(`/quiz/${quizId}/question/${previousQuestion.id_question}`);
        } else {
            navigate(`/quizz/${quizzInfo.id_chapitre}`);
        }
    };
    
 
    

    const handleAnswerSelect = (answerId) => {
        let updatedAnswers;
    
        if (questionType === 'seul' || questionType === 'vrai' || questionType === 'faux') {
            // For single choice questions, set selectedAnswers to the current answerId exclusively
            updatedAnswers = [answerId];
        } else {
            updatedAnswers = selectedAnswers.includes(answerId) ?
                selectedAnswers.filter(id => id !== answerId) : [...selectedAnswers, answerId];
        }
    
        setSelectedAnswers(updatedAnswers);
        handleSelectAnswer(answerId, questionType);  // Assuming you might want to do something with this globally
    };
    
    

    const getIndicationText = () => {
        switch (questionType) {
            case 'seul':
                return 'Choisissez la bonne réponse';
            case 'multi':
                return 'Choisissez les bonnes réponses';
            case 'vrai':
                return 'Selectionner la réponse vraie';
            case 'faux':
                return 'Selectionner la réponse fausse';
            default:
                return '';
        }
    };

    if (!currentQuestion || !currentQuestion.answers) return <div>Aucune question disponible</div>;

    return (
        <div className='background-question'>
            <div className='base_container_quizz_question'>
            <Typography sx={{fontSize: { xs: "2em", sm: "3em", md: "4em" }}} className='quizz-title'>{quizzInfo.label || 'Titre non disponible'}</Typography>
                <div className='question-quest-container'>
                <Typography sx={{fontSize: { xs: "1em", sm: "1.5em", md: "2em" }}} className='Question_titre'>{currentQuestion.label || 'Texte de question non disponible'}</Typography>
                    <Typography sx={{fontSize: { xs: "0.5em", sm: "1.0em", md: "1.5em" }}}>{getIndicationText()}</Typography>
                    
                    <Box className="reponse-container"
                        sx={{
                        display: 'flex',           // Enable flexbox
                        flexDirection: 'column',   // Stack children vertically
                        alignItems: 'center',      // Center items horizontally
                        width: '100%',             // Full width container
                        p: 1                       // Padding around the box
                        }}>
                    {currentQuestion.answers.length > 0 ? currentQuestion.answers.map((answer) => (
                        <Button key={answer.id_reponse}
                        variant="contained"
                        sx={{
                          mb: 1,
                          background: selectedAnswers.includes(answer.id_reponse) ? '#6998EA' : 'white', // Updated color names
                          color: 'black',
                          '&:hover': {
                            backgroundColor: '#6998EA', // Ensure consistency in color names
                          },
                          '&:focus': {
                            backgroundColor: '#6998EA', 
                          },
                          width: '80%',
                          height: '50px',
                        }}
                        onClick={() => handleAnswerSelect(answer.id_reponse)}>
                  {answer.contenu}
                </Button>
                
                    )) : <Typography variant="subtitle1">Pas de réponses disponibles</Typography>}
                    </Box>
                </div>
                <div className='button-container'>
                    <StyledButton onClick={navigateToPreviousQuestion} width={300} color={"secondary"} content={"Retour"} className='btn_retour button-connection'></StyledButton>
                    <StyledButton onClick={navigateToNextQuestion} width={300} color={"primary"} content={"Valider"} className='btn_valider button-connection'></StyledButton>
                </div>
            </div>
        </div>
    
    );
}

export default Question;
