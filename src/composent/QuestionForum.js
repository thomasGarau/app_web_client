import { Button, List, ListItem, ListItemText, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import {getForumByCours } from "../composent/QuestionAPI.js";
import { useNavigate } from 'react-router-dom';
function QuestionForum({ courseId }) {  // Utilisation de la destructuration pour extraire courseId du prop
    const [questions, setQuestions] = useState([])
    const style = {
        fontFamily: "Nanum Pen Script",
        fontSize: "1em",
    };
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const data = await getForumByCours(courseId);
                setQuestions(data);
                console.log("qiu : ", questions);
            } catch (error) {
                console.error("Erreur lors de la récupération des questions :", error);
            }
        };

        if (courseId) {
            fetchQuestions();
        }
    }, [courseId]);

    const toForum = (question) => {
        navigate(`/forum?question=${question[0]}&pseudo=${question[1]}&date=${question[2]}&etat=${question[3]}`);
    }
    console.log(window.visualViewport)

    return (
        <div className='question-part'>
            <span className="forum-component-title">Forum</span>
            <List className='button-ul'>
                {questions.map(question => (
                    <Button key={question[0]} style={{ width: "100%" }} onClick={() => toForum(question)}>
                        {window.visualViewport.width <= 600 ? 
                            <ListItem className="list-button" style={{ width: "100%" }}>
                                <Typography style={style}>{question[0]}</Typography>
                            </ListItem> : 
                            <ListItem className="list-button" style={{ width: "100%" }}>
                                <ListItemText primaryTypographyProps={{ style: style }} primary={question[0]} />
                                <ListItemText primaryTypographyProps={{ style: style }} primary={question[1]} />
                                <ListItemText primaryTypographyProps={{ style: style }} primary={question[2]} />
                                <ListItemText primaryTypographyProps={{ style: style }} primary={question[3]} />
                            </ListItem>
                        }
                    </Button>
                ))}
            </List>
        </div>
    )
}
export default QuestionForum;
