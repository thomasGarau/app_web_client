import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';


import Header from '../composent/Header';
import './Forum.css';

function Forum(){

    const {state} = useLocation()

    const [discussions, setDiscussions] = useState([{question: state.question, username: state.username, date: state.date, etat: state.etat}])
    console.log(discussions);

    return (
        <div className='background-forum'>
            <Header></Header>          
            <div className='forum-container'>
            <h1>{state.question}</h1>
            {discussions.map(poste =>
                <div className="forum-question" key={poste.question}>
                    <span>{poste.username} - {poste.date}</span>
                    <div className='question'>
                        <span >{poste.question}</span>
                        <button className='answer-button'>repondre</button>
                    </div>
                </div>
            )}
              
            </div>     
        </div>
    )

} export default Forum;
