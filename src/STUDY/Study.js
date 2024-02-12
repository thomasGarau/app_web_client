//dependances
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../composent/Header';
import './Study.css';

function Study(){

    const [cours, setCours] = useState("Lorem Ipsum");
    const [texte, setTexte] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus semper leo sed magna tincidunt, nec suscipit sem ullamcorper. Duis at felis id turpis semper facilisis sed sed nulla. Donec consequat aliquet nulla, vel elementum erat luctus sit amet. Nunc pretium posuere ex nec posuere. Praesent sit amet nulla ac lacus accumsan fermentum sodales non tellus. Sed est sapien, tempus non rutrum at, porttitor placerat sem. Pellentesque sed hendrerit sem. Mauris lobortis sagittis augue, ac imperdiet dolor gravida quis. Phasellus sapien velit, scelerisque pretium odio quis, tincidunt facilisis lectus. Nulla sit amet vehicula tortor. Nam faucibus ex nisi, sed bibendum leo accumsan id.")
    const [questions, setQuestions] = useState([["Une question?", "Username", "10:25:31 05/02/2024", "Ferme"], ["Deux question?", "Username2", "03-02-2024", "Ouvert"]])
    const [nav, setNav] = useState(false);
    const [passQuestion, setPassQuestion] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if(nav){
            navigate("/forum", { state: {question: passQuestion[0], username: passQuestion[1], date: passQuestion[2], etat: passQuestion[3]}});
        }
    })

    return (
        <div className='background-study'>
            <Header></Header>
            <div className='text-part'>
                <h1 className='study-title'>{cours}</h1>
                <p>{texte}</p>
            </div>               
            <div className='question-part'>
                <ul>
                {questions.map(question => 
                    <li key={question[0]}>
                        <span onClick={() => {setNav(true); setPassQuestion(question)}}>{question[0]}</span>
                        <span>{question[1]}</span>
                        <span>{question[2]}</span>
                        <span>{question[3]}</span>
                    </li>)}
                </ul>
            </div>
        </div>
    )
} export default Study;
