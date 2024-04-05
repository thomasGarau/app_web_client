import { Button, List, ListItem, ListItemText, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function QuestionForum() {
    const [questions, setQuestions] = useState([["Une question?", "Username", "10:25:31 05/02/2024", "Ferme"], ["Deux question?", "Username2", "03-02-2024", "Ouvert"], ["Deux question?", "Username2", "03-02-2024", "Ouvert"]])
    const style = {
        fontFamily: "Nanum Pen Script",
        fontSize: "1em",
      };
    const navigate = useNavigate();

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
                        <ListItem className="list-button" style={{ width: "100%" }} >
                            <Typography style={style}>{question[0]}</Typography>
                        </ListItem> : 
                        <ListItem className="list-button" style={{ width: "100%" }} >
                            <ListItemText primaryTypographyProps={{ style: style}} primary={question[0]}/>
                            <ListItemText primaryTypographyProps={{ style: style }} primary={question[1]}/>
                            <ListItemText primaryTypographyProps={{ style: style }} primary={question[2]}/>
                            <ListItemText primaryTypographyProps={{ style: style }} primary={question[3]}/>
                        </ListItem>}
                        
                    </Button>
                ))}
            </List>
        </div>
    )
} export default QuestionForum;
