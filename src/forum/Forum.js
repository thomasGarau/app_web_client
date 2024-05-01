import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiCommentPlus, mdiAlert } from '@mdi/js';
import Header from '../composent/Header';
import './Forum.css';
import { Button, ButtonGroup, IconButton } from '@mui/material';

function Forum() {

    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const question = params.get('question');
    const pseudo = params.get('pseudo');
    const date_nav = params.get('date');
    const etat = params.get('etat');

    // Vérifiez si les paramètres existent avant de les ajouter à l'état
    const initialDiscussion = question && pseudo && date_nav && etat ? [[question, pseudo, date_nav, etat]] : [];

    const [overQuestion, setOverQuestion] = useState(false);
    const [message, setMessage] = useState('');
    const [discussions, setDiscussions] = useState(initialDiscussion);
    const [lastQuestion, setLastQuestion] = useState()
    console.log(discussions)

    const handleChange = (e) => {
        setMessage(e.target.value);
    }

    const submitMessage = (e) => {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.getDate();
        const showtime = today.getHours()
            + ':' + today.getMinutes()
            + ":" + today.getSeconds();
        const currentDate = showtime + " " + date + "/" + month + "/" + year;

        if (e.key === 'Enter') {
            const newMessage = [e.target.value, "username", currentDate];
            setDiscussions(prevMessage => [...prevMessage, newMessage]);

        }
    }

    useEffect(() => {
        setMessage('');
    }, [discussions])

    return (
        <div className='background-forum'>
            <Header></Header>
            <div className='forum-container'>
                <div className='title-container'>
                    <h1 className='forum-title'>{discussions[0][0]}</h1>
                    <span className='title-date'>{discussions[0][2]}</span>
                </div>
                <div className='forum-question-container'>
                    {discussions.map(poste =>
                        <div className="forum-question"
                            key={poste[0]}
                            onMouseOver={() => setOverQuestion(true)}
                            onMouseOut={() => setOverQuestion(false)}>
                            <div className='question-head'>
                                <span className='who-when'>{poste[1]} - {poste[2]}</span>
                                {/* <ButtonGroup className={overQuestion ? 'button-container-show' : 'button-container-hide'}>
                                    <IconButton variant='outlined'><Icon path={mdiCommentPlus} size={1} /></IconButton>
                                    <IconButton variant='outlined'><Icon path={mdiAlert} size={1} /></IconButton>
                                </ButtonGroup> */}
                            </div>
                            <div className={discussions.indexOf(poste) % 2 == 1 ? 'question blue' : 'question grey'}>
                                <span className='question-text'>{poste[0]}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className='comment-footer'>
                    <input
                        className='input-forum'
                        placeholder='Nouveau message...'
                        onChange={handleChange}
                        onKeyDown={submitMessage}
                        value={message} />
                </div>


            </div>
        </div>
    )

} export default Forum;
