//dependances
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../composent/Header';
import './Study.css';
import { Button } from '@mui/material';
import QuestionForum from '../composent/QuestionForum';

function Study() {

    const [cours, setCours] = useState("Lorem Ipsum");
    const [texte, setTexte] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus semper leo sed magna tincidunt, nec suscipit sem ullamcorper. Duis at felis id turpis semper facilisis sed sed nulla. Donec consequat aliquet nulla, vel elementum erat luctus sit amet. Nunc pretium posuere ex nec posuere. Praesent sit amet nulla ac lacus accumsan fermentum sodales non tellus. Sed est sapien, tempus non rutrum at, porttitor placerat sem. Pellentesque sed hendrerit sem. Mauris lobortis sagittis augue, ac imperdiet dolor gravida quis. Phasellus sapien velit, scelerisque pretium odio quis, tincidunt facilisis lectus. Nulla sit amet vehicula tortor. Nam faucibus ex nisi, sed bibendum leo accumsan id.")
    


    return (
        <div className='background-study'>
            <div className='sub_container_text_question'>
            <div className='text-part'>
                <h1 className='study-title'>{cours}</h1>
                <p className='paragraphe'>{texte}</p>
            </div>
            <QuestionForum></QuestionForum>
            </div>
        </div>
    )
} export default Study;
