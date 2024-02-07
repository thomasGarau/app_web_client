import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';


import Header from '../composent/Header';
import './Forum.css';

function Forum() {

    const { state } = useLocation()

    const [discussions, setDiscussions] = useState([{ question: state.question, username: state.username, date: state.date, etat: state.etat }])
    const [overQuestion, setOverQuestion] = useState(false);
    const [message, setMessage] = useState('');

    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    const showtime = today.getHours() 
    + ':' + today.getMinutes() 
    + ":" + today.getSeconds();
    const currentDate = showtime + " " + date + "/" + month + "/" + year;


    const handleChange = (e) => {
        setMessage(e.target.value);
    }

    const submitMessage = (e) => {
        if (e.key === 'Enter') {
            const newMessage = {question: message, username: "username", date: currentDate, etat: "Ouvert"};
            setDiscussions(prevMessage => [...prevMessage, newMessage]);
            setMessage('');
        }
    }

    return (
        <div className='background-forum'>
            <Header></Header>
            <div className='forum-container'>
                <div className='title-container'>
                    <h1 className='forum-title'>{state.question}</h1>
                    <span className='title-date'>{state.date}</span>
                </div>
                {discussions.map(poste =>
                    <div className="forum-question"
                        key={poste.question}
                        onMouseOver={() => setOverQuestion(true)}
                        onMouseOut={() => setOverQuestion(false)}>
                        <div className='question-head'>
                            <span className='who-when'>{poste.username} - {poste.date}</span>
                            <div className={overQuestion ? 'button-container-show' : 'button-container-hide'}>
                                <button className='reaction-button'></button>
                                <button className='reaction-button'></button>
                            </div>
                        </div>
                        <div className='question'>
                            <span className='question-text'>{poste.question}</span>
                        </div>
                    </div>
                )}
                <input
                    className='input-forum'
                    placeholder='Nouveau message...'
                    onChange={handleChange}
                    onKeyDown={submitMessage}
                    value={message} />

            </div>
        </div>
    )

} export default Forum;
