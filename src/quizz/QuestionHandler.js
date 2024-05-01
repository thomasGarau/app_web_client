import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getQuestionParQUizz } from './QuizzAPI'; // Assurez-vous que cet import est correct

function QuestionHandler() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const data = await getQuestionParQUizz(quizId);
                setQuestions(data);
                if (data && data.length > 0) {
                   console.log("on navigue youhou : ", data);
                  navigate(`/quiz/${quizId}/question/${data[0].id_question}`);
                } else {
                    // Gérer le cas où il n'y a pas de questions
                    console.error("Aucune question trouvée pour ce quiz");
                    navigate('/no-questions'); // Assurez-vous de gérer cette route quelque part
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des questions :", error);
                navigate('/error'); // Gérer cette route pour montrer une page d'erreur
            }
        };

        fetchQuestions();
    }, [quizId, navigate]);

    return null; 
}

export default QuestionHandler;
