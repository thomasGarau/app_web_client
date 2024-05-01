import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from './QuizContext';
import { handleSubmit, getQuizzInfo } from './QuizzAPI';
import Header from '../composent/Header.js';

function QuizzFin() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const { allSelectedAnswers, resetSelectedAnswers } = useQuiz();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [finalScore, setFinalScore] = useState('');  // Ajouter cet état pour stocker la note finale
    const info = getQuizzInfo(quizId);

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

    }, [quizId, allSelectedAnswers, isSubmitted, resetSelectedAnswers]); // Incluez resetSelectedAnswers dans les dépendances

    return (
        <div className='quiz-summary'>
            <Header />
            <h1 style={{ marginTop: "140px" }}>Résumé du Quiz</h1>
            <button onClick={() => navigate(`/quizz/${info.id_ue}`)}>Menu Quizz</button>
            <p>Merci d'avoir participé au quiz. Vous avez terminé avec succès le quiz.</p>
            <p>Score final: {finalScore}</p>  {/* Afficher la note finale ici */}
        </div>
    );
}

export default QuizzFin;
