//dependances
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../composent/Header';
import './Study.css';

function Study(){

    const [cours, setCours] = useState("Lorem Ipsum");
    const [texte, setTexte] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus semper leo sed magna tincidunt, nec suscipit sem ullamcorper. Duis at felis id turpis semper facilisis sed sed nulla. Donec consequat aliquet nulla, vel elementum erat luctus sit amet. Nunc pretium posuere ex nec posuere. Praesent sit amet nulla ac lacus accumsan fermentum sodales non tellus. Sed est sapien, tempus non rutrum at, porttitor placerat sem. Pellentesque sed hendrerit sem. Mauris lobortis sagittis augue, ac imperdiet dolor gravida quis. Phasellus sapien velit, scelerisque pretium odio quis, tincidunt facilisis lectus. Nulla sit amet vehicula tortor. Nam faucibus ex nisi, sed bibendum leo accumsan id.")
    const [questions, setQuestions] = useState(["Une question?", "Deux question?"])


    return (
        <div className='background-study'>
            <Header></Header>
            <div className='text-part'>
                <h1>{cours}</h1>
                <p>{texte}</p>
            </div>               
            <div className='question-part'>
                <ul>
                {questions.map(question => <li>{question}</li>)}
                </ul>
            </div>
        </div>
    )
} export default Study;
