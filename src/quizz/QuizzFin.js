import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from './QuizContext';
import { handleSubmit, getQuizzInfo, getLastNoteQuizz } from '../API/QuizzAPI';
import RatingStars from '../composent/RatingStars.js';
import StyledButton from '../composent/StyledBouton.js';
import QuestionForum from '../composent/QuestionForum';
import { getUserInfo } from '../API/ProfileAPI';
import StyledBox from '../composent/StyledBox.js';
import { Typography } from '@mui/material';

function QuizzFin() {
    const { quizId } = useParams();
    const [chap_id, setChapId] = useState('');  
    const navigate = useNavigate();
    const { allSelectedAnswers, resetSelectedAnswers } = useQuiz();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [role, setRole] = useState('');
    const [finalScore, setFinalScore] = useState('');  
    const [label, setLabel] = useState('');
    const [id_quizz_note, setIdQuizzNote] = useState('');

    useEffect(() => {
        
        if (allSelectedAnswers.length > 0 && !isSubmitted) {
            handleSubmit(quizId, allSelectedAnswers)
                .then(response => {
                    setIsSubmitted(true);
                    setFinalScore(response.resultat.noteFinale);  // Stocker la note finale obtenue dans l'état
                    resetSelectedAnswers();  
                })
                .catch(error => {
                    console.error('Erreur lors de la soumission:', error);
                });

        }
        getUserInfo()
        .then(response_info => {
            setRole(response_info.role);
        })
        getQuizzInfo(quizId)
            .then(response => {
                setChapId(response.id_chapitre);  
                setLabel(response.label);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des informations du quiz:', error);
            });
        getLastNoteQuizz(quizId)
            .then(response => {
                setFinalScore(response.note);  
                setIdQuizzNote(response.id_note_quizz);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération de la dernière note du quiz:', error);
            });

    }, [quizId, allSelectedAnswers, isSubmitted, resetSelectedAnswers]); // Incluez resetSelectedAnswers dans les dépendances

    return (
        <div className='quiz-final-background'>
            <div className='quiz-final-summary'>
                <div className='quiz-final-button-top'>
                    <StyledButton content={"Quizz"} fontSize={"1.5em"} onClick={() => navigate(`/quizz/${chap_id}`)}/>
                    <StyledBox content={label} fontSize={"1.5em"}/>
                </div>
                <div className='quiz-final-score'>
                    <div className='quiz-final-demi-cercle'>
                        <div className='quiz-final-demi-cercle-vide'>
                            <Typography>{finalScore}%</Typography>
                        </div>
                    </div>
                    <RatingStars quizId={quizId} />
                    <h2>Bravo !</h2>
                    <StyledButton content={"Relire les questions"} color={"primary"} fontSize={"1.5em"} onClick={() => navigate(`/statQuizz/${quizId}/${id_quizz_note}`)}/>
                    
                </div>
                <QuestionForum id_quizz={quizId} role={role}  />

            </div>
        </div>
    );
}

export default QuizzFin;
