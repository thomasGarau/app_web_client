import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from './QuizContext';
import { handleSubmit, getQuizzInfo, getLastNoteQuizz } from './QuizzAPI';
import Header from '../composent/Header.js';
import RatingStars from '../composent/RatingStars.js';
import StyledButton from '../composent/StyledBouton.js';

function QuizzFin() {
    const { quizId } = useParams();
    const [chap_id, setChapId] = useState('');  
    const navigate = useNavigate();
    const { allSelectedAnswers, resetSelectedAnswers } = useQuiz();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [finalScore, setFinalScore] = useState('');  

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
        <div className='quiz-final-summary'>
            <Header />
            {/* 
            <h1 style={{ marginTop: "140px" }}>Résumé du Quiz</h1>
            <button onClick={() => navigate(`/quizz/${chap_id}`)}>Menu Quizz</button>
            <p>Merci d'avoir participé au quiz. Vous avez terminé avec succès le quiz.</p>
            <p>Score final: {finalScore}</p>  
            */}

            <div className='quiz-final-button-top'>
                <button className='btn_quiz-final button-connection' onClick={() => navigate(`/quizz/${chap_id}`)}>Menu Quizz</button>
                <p className='theme_quiz-final'>Info sujet quizz</p>
            </div>
            <div className='quiz-final-score'>
                <div className='quiz-final-demi-cercle'>
                    <div className='quiz-final-demi-cercle-vide'>
                        <p>{finalScore}%</p>
                    </div>
                </div>
                <RatingStars />
                <h2>Bravo !</h2>
                <StyledButton content={"Relire les questions"} color={"primary"} onClick={() => navigate(`/quizz/${chap_id}`)}/>
            </div>

        </div>
    );
}

export default QuizzFin;
