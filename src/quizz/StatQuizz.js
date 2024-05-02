//dependances
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

//modules
import { getStatQuestions } from './QuizzAPI.js';
import { Link, Box, Typography, Avatar } from '@mui/material';
import './StatQuizz.css';
import "@fontsource/nanum-pen-script";
import { green, red } from '@mui/material/colors';



function StatQuizz() {
    const { id } = useParams();

    const [listQuestions, setListQuestions] = useState([])

    const navigate = useNavigate();

    useEffect(() => {
        const fetchStatQuestions = async () => {
            try {
                const questions = await getStatQuestions(id);
                setListQuestions(questions);
            } catch (error) {
                console.error('Erreur lors de la récupération des questions:', error);
            }
        };
        fetchStatQuestions();
    }, [id]);

    useEffect(() => {
        console.log(listQuestions)
    }, [listQuestions])

    const handleQuestionClick = (id_question) => {
        navigate(`/quizz/${id}/stat/${id_question}`);
    }


    return (
        <div className='background-question-list'>
            <div className='questions-list-container'>
                <Typography className="question-list-title" style={{ fontSize: "4em", margin: "0px" }}>Liste des questions</Typography>
                <div className='questions-list-subcontainer'>
                    {listQuestions.length > 0 ? (
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
