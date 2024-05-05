import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getQuestionParQUizz, getReponsesPourQuestion, getQuizzInfo } from './QuizzAPI';
import { useQuiz } from './QuizContext';

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
        let updatedAnswers = selectedAnswers.includes(answerId) ?
            selectedAnswers.filter(id => id !== answerId) : [...selectedAnswers, answerId];
    
        setSelectedAnswers(updatedAnswers);

        // Update global state for all selected answers
        handleSelectAnswer(answerId, questionType);
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
                <h1 className='quizz-title'>{quizzInfo.label || 'Titre non disponible'}</h1>
                <div className='question-quest-container'>
                    <h3 className='Question_titre'>{currentQuestion.label || 'Texte de question non disponible'}</h3>
                    <p className='indication'>{getIndicationText()}</p>
                    <div className='reponse-container'>
                        {currentQuestion.answers.length > 0 ? currentQuestion.answers.map((answer) => (
                            <button key={answer.id_reponse}
                                    className={`reponse ${selectedAnswers.includes(answer.id_reponse) ? 'selected' : ''}`}
                                    onClick={() => handleAnswerSelect(answer.id_reponse)}>
                                {answer.contenu}
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

export default Question;
