//dependances
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

//modules
import { getNoteQuizzInfo, getQuestionParQUizz, getReponsesPourQuestion, getStatQuestions } from '../API/QuizzAPI.js';
import { Link, Box, Typography, Avatar } from '@mui/material';
import './StatQuizz.css';
import "@fontsource/nanum-pen-script";
import { green, red } from '@mui/material/colors';
import { getTokenAndRole } from '../services/Cookie.js';
import AnnotationQuiz from '../annotation/AnnotationQuiz.js';



function StatQuizz() {
    const { quizId, noteQuizId } = useParams();
    const [listQuestions, setListQuestions] = useState([])
    const [infos, setInfos] = useState({})

    const navigate = useNavigate();

    useEffect(() => {
        const fetchStatQuestions = async () => {
            try {
                const questions = await getNoteQuizzInfo(noteQuizId);
                const questionsBis = await getQuestionParQUizz(quizId);
                setListQuestions(questions.details.map(question1 => {
                    const matchingQuestion2 = questionsBis.find(question2 => question2.id_question === question1.id_question);

                    return {
                        ...question1,
                        ...matchingQuestion2
                    };
                }));
                setInfos(questions.resultat)
            } catch (error) {
                console.error('Erreur lors de la récupération des questions:', error);
            }
        };
        fetchStatQuestions();
    }, [noteQuizId]);

    useEffect(() => {

    }, [listQuestions])

    const handleQuestionClick = (id_question) => {
        navigate(`/statQuizz/${quizId}/${noteQuizId}/${id_question}`);
    }


    return (
        <div className='background-question-list'>
            <div className='questions-list-container'>
                <Typography className="question-list-title" style={{ fontSize: { xs: "1em", sm: "2em", md: "3em" }, margin: "0px" }}>Liste des questions du quizz {infos.label}</Typography>
                <div className='questions-list-subcontainer'>
                    {listQuestions && listQuestions.length > 0 ? (
                        listQuestions.map((question, index) => (
                            <Box sx={{ width: { xs: '80%', sm: '75%', md: '50%' } }} key={question.id_question} className="question-container" onClick={() => handleQuestionClick(question.id_question)}>
                                
                                <Typography sx={{
                                    flex: 1, fontSize: { xs: "0.8em", sm: "1.2em", md: "1.6em" },
                                    overflow: 'hidden',
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    marginRight: "10px"
                                }} className='question-title'>{question.label}</Typography>
                                <Typography sx={{ textAlign: "center", fontSize: { xs: "0.8em", sm: "1.2em", md: "1.6em" } }} className='question-title'>
                                    Reponse de l'élève: {question.reponsesUtilisateur.every((value, index) => value === question.bonnesReponses[index]) ? "juste" : "fausse"}
                                </Typography>

                                {question.reponsesUtilisateur.every((value, index) => value === question.bonnesReponses[index]) ? <Avatar sx={{ bgcolor: green[500], marginLeft: "10px" }}> </Avatar> : <Avatar sx={{ bgcolor: red[500], marginLeft: "10px" }}> </Avatar>}
                            </Box>
                        ))
                    ) : (
                        <p>Aucune question disponible pour ce quizz.</p>
                    )

                    }
                </div>

            </div>
        </div>
    );
} export default StatQuizz;
