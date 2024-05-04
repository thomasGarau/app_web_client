import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button, IconButton, ButtonGroup } from '@mui/material';
import Icon from '@mdi/react';
import { mdiCommentPlus, mdiAlert } from '@mdi/js';
import './Forum.css';
import StyledButton from "../composent/StyledBouton";
import { getMessageForum, ajouterMessageForum, cloturerForum } from './ForumAPI';
import { jwtDecode } from 'jwt-decode';
import {getTokenAndRole} from '../services/Cookie';



function Forum() {
    const { id_forum } = useParams();
    const [discussions, setDiscussions] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [forumInfo, setForumInfo] = useState({});
    const [isOwner, setIsOwner] = useState(false);
    const endOfMessagesRef = useRef(null);

    
    

    async function fetchData() {
        const {token, role} = await getTokenAndRole();
        console.log("token : ",token);
        const decodedToken = jwtDecode(token);
        console.log("decodedToken : ",decodedToken);
        const id_utilisateur = decodedToken.id_etudiant;
        console.log("id_utilisateur : ",id_utilisateur);
        const data = await getMessageForum(id_forum);
        setDiscussions(data.messages);
        setForumInfo(data.forum_information);
        setIsOwner(data.forum_information.forum_id_utilisateur === id_utilisateur);
    }

    useEffect(() => {
        fetchData();
    }, [id_forum]);

    useEffect(() => {
        scrollToBottom();
    }, [discussions]);

    const handleChange = (e) => {
        setNewMessage(e.target.value);
    };

    const submitMessage = async (e) => {
        if (e.key === 'Enter' && newMessage.trim() !== '') {
            e.preventDefault();
            try {
                await ajouterMessageForum(id_forum, newMessage);
                await fetchData();
                setNewMessage('');
            } catch (error) {
                console.error('Erreur lors de l\'envoi du message:', error);
            }
        }
    };

    const handleCloseForum = async () => {
        try {
            await cloturerForum(id_forum); // Supposons que cette fonction existe dans votre API
            alert('Le forum a été clôturé.');
        } catch (error) {
            console.error('Erreur lors de la clôture du forum:', error);
        }
    };

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className='background-forum'>
            <div className='forum-container'>
                <div className='title-container'>
                    <h1 className='forum-title'>Forum</h1>
                </div>
                <div className='forum-question-container'>
                    {discussions.map((post, index) => (
                        <div className="forum-question" key={post.id_message}>
                            <div className='question-head'>
                                <span className='who-when'>{`${post.nom} ${post.prenom} (${post.message_heure} ${post.message_date})`}</span>
                            </div>
                            <div className={index % 2 === 1 ? 'question blue' : 'question grey'}>
                                <span className='question-text'>{post.message_contenu}</span>
                            </div>
                        </div>
                    ))}
                    <div ref={endOfMessagesRef} />
                </div>
                <div className='comment-footer'>
                    <input
                        className='input-forum'
                        placeholder='Nouveau message...'
                        onChange={handleChange}
                        onKeyDown={submitMessage}
                        value={newMessage}
                    />
                    {isOwner && (
                        <StyledButton
                        width={'150px'}
                        content={"Cloturer le forum"}
                        color={"primary"}
                        fontSize={"1.2em"}
                        onClick={handleCloseForum}
                    />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Forum;
