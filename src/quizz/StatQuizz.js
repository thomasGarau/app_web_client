//dependances
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJwt } from "react-jwt";

//modules
import { getStatQuestions } from './QuizzAPI.js';
import { Link, Box, Typography, Avatar } from '@mui/material';
import './StatQuizz.css';
import "@fontsource/nanum-pen-script";
import { green, red } from '@mui/material/colors';
import { getTokenAndRole } from '../services/Cookie.js';



function StatQuizz() {
    const { quizId, noteQuizId } = useParams();
    const {token, role} = getTokenAndRole();
    const { decodedToken, isExpired } = useJwt(token)
    const [listQuestions, setListQuestions] = useState([])

    const navigate = useNavigate();

    useEffect(() => {
        const fetchStatQuestions = async () => {
            try {
                const questions = await getStatQuestions(noteQuizId);
                setListQuestions(questions.resultat);
            } catch (error) {
                console.error('Erreur lors de la récupération des questions:', error);
            }
        };
        fetchStatQuestions();
    }, [noteQuizId]);

    useEffect(() => {
        console.log(listQuestions)
    }, [listQuestions])

    const handleQuestionClick = (id_question) => {
        console.log(decodedToken)
        navigate(`/statQuizz/${quizId}/${noteQuizId}/${id_question}`);
    }


    return (
        <div className='background-question-list'>
            <div className='questions-list-container'>
                <Typography className="question-list-title" style={{ fontSize: "4em", margin: "0px" }}>Liste des questions</Typography>
                <div className='questions-list-subcontainer'>
                    {listQuestions && listQuestions.length > 0 ? (
                        listQuestions.map((question, index) => (
                            <div key={question.id_question} className="question-container" onClick={() => handleQuestionClick(question.id_question)}>
                                <Typography sx={{flex:1}} className='question-title'>{question.label}</Typography>
                                <Typography className='question-title'>Reponse de l'élève: {question.reponseUtilisateur === question.bonneReponses ? "juste" : "fausse"} 
                                </Typography>
                                {question.reponseUtilisateur === question.bonneReponses ? <Avatar sx={{ bgcolor: green[500], marginLeft: "10px" }}> </Avatar> : <Avatar sx={{ bgcolor: red[500], marginLeft: "10px"}}> </Avatar>}
                            </div>
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
