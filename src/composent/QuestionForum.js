import { Button } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function QuestionForum() {
    const [questions, setQuestions] = useState([["Une question?", "Username", "10:25:31 05/02/2024", "Ferme"], ["Deux question?", "Username2", "03-02-2024", "Ouvert"]])

    const navigate = useNavigate();

    const toForum = (question) => {
        navigate(`/forum?question=${question[0]}&pseudo=${question[1]}&date=${question[2]}&etat=${question[3]}`);
    }    

    return (
        <div className='question-part'>
            <span className="forum-component-title">Forum</span>
            <ul className='button-ul'>
                {questions.map(question => (
                    <Button key={question[0]} style={{ width: "100%" }} onClick={() => toForum(question)}>
                        <li className="list-button" style={{ width: "100%" }} >
                            <span >{question[0]}</span>
                            <span>{question[1]}</span>
                            <span>{question[2]}</span>
                            <span>{question[3]}</span>
                        </li>
                    </Button>
                ))}
            </ul>
        </div>
    )
} export default QuestionForum;
