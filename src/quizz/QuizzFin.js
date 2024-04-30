import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuiz } from './QuizContext';
import { handleSubmit } from './QuizzAPI'; // Assurez-vous que le chemin d'importation est correct
import Header from '../composent/Header.js';

function QuizzFin() {
    const { quizId } = useParams(); // Assumant que le quizId est passé via les paramètres d'URL
    const { allSelectedAnswers } = useQuiz();
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        // Vérifiez si la soumission a déjà été faite ou non, et si des réponses sont disponibles
        if (allSelectedAnswers.length > 0 && !isSubmitted) {
            handleSubmit(quizId, allSelectedAnswers)
                .then(response => {
                    console.log('Réponse du serveur:', response);
                    setIsSubmitted(true);  // Marquer comme soumis pour éviter de réexécuter
                })
                .catch(error => {
                    console.error('Erreur lors de la soumission:', error);
                });
        }
    }, [quizId, allSelectedAnswers, isSubmitted]); // Incluez quizId et allSelectedAnswers
    
    
    return (
        <div className='quiz-summary'>
            <Header />
            <h1 style={{ marginTop: "140px" }}>Résumé du Quiz</h1>
            {allSelectedAnswers.length > 0 ? (
                <ul>
                    {allSelectedAnswers.map(answerId => (
                        <li key={answerId}>Réponse sélectionnée ID: {answerId}</li>
                    ))}
                </ul>
            ) : (
                <p>Aucune réponse sélectionnée ou données non disponibles.</p>
            )}
        </div>
    );
}

export default QuizzFin;
