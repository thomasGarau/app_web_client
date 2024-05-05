import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from './QuizContext';
import { handleSubmit, getQuizzInfo, getLastNoteQuizz } from './QuizzAPI';
import RatingStars from '../composent/RatingStars.js';
import StyledButton from '../composent/StyledBouton.js';
import QuestionForum from '../composent/QuestionForum';

function QuizzFin() {
    const { quizId } = useParams();
    const [chap_id, setChapId] = useState('');  
    const navigate = useNavigate();
    const { allSelectedAnswers, resetSelectedAnswers } = useQuiz();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [finalScore, setFinalScore] = useState('');  
    const [label, setLabel] = useState('');

    useEffect(() => {
        
        if (allSelectedAnswers.length > 0 && !isSubmitted) {
            handleSubmit(quizId, allSelectedAnswers)
                .then(response => {
                    console.log('Réponse du serveur:', response);
                    setIsSubmitted(true);
                    setFinalScore(response.resultat.noteFinale);  // Stocker la note finale obtenue dans l'état
                    resetSelectedAnswers();  
                })
                .catch(error => {
                    console.error('Erreur lors de la soumission:', error);
                });

        }
        getQuizzInfo(quizId)
            .then(response => {
                console.log('Réponse de getQuizzInfo:', response);
                setChapId(response.id_chapitre);  
                setLabel(response.label);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des informations du quiz:', error);
            });
        getLastNoteQuizz(quizId)
            .then(response => {
                console.log('Réponse de getLastNoteQuizz:', response);
                setFinalScore(response.note);  
            })
            .catch(error => {
                console.error('Erreur lors de la récupération de la dernière note du quiz:', error);
            });

    }, [quizId, allSelectedAnswers, isSubmitted, resetSelectedAnswers]); // Incluez resetSelectedAnswers dans les dépendances

    return (
        <div className='quiz-final-background'>
            <div className='quiz-final-summary'>
                <div className='quiz-final-button-top'>
                    <StyledButton content={"Quizz"} width={"25%"} fontSize={"1.5em"} onClick={() => navigate(`/quizz/${chap_id}`)}/>
                    <p className='theme_quiz-final'>{label}</p>
                </div>
                <div className='quiz-final-score'>
                    <div className='quiz-final-demi-cercle'>
                        <div className='quiz-final-demi-cercle-vide'>
                            <p>{finalScore}%</p>
                        </div>
                    </div>
                    <RatingStars quizId={quizId} />
                    <h2>Bravo !</h2>
                    <StyledButton content={"Relire les questions"} color={"primary"} fontSize={"1.5em"} onClick={() => navigate(`/quizz/${chap_id}`)}/>
                    
                </div>
                <QuestionForum id_quizz={quizId}  />

            </div>
        </div>
    );
}

export default QuizzFin;
