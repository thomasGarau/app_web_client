import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Popover, Typography } from '@mui/material';
import './Forum.css';
import StyledButton from "../composent/StyledBouton";
import { getMessageForum, ajouterMessageForum, closeForum } from '../API/ForumAPI';
import { jwtDecode } from 'jwt-decode';
import { getTokenAndRole } from '../services/Cookie';
import { contenuRegex } from '../services/Regex';



function Forum() {
    const { id_forum } = useParams();
    const [discussions, setDiscussions] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isOwner, setIsOwner] = useState(false);
    const [titreForum, setTitreForum] = useState('');
    const [isClosed, setIsClosed] = useState(false);
    const endOfMessagesRef = useRef(null);
    const [errorAnchorEl, setErrorAnchorEl] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [id, setId] = useState(undefined);
    const [open, setOpen] = useState(false);


    async function fetchData() {
        const { token, role } = await getTokenAndRole();
        const decodedToken = jwtDecode(token);
        const id_utilisateur = decodedToken.id_etudiant;
        const data = await getMessageForum(id_forum);
        setIsClosed(data.forum_information.forum_etat === '0');
        if (isClosed) {
        }

        // Trier les messages par date et heure
        const sortedMessages = data.messages.sort((a, b) => {
            // Reformater la date de DD/MM/YYYY à YYYY-MM-DD
            const datePartsA = a.message_date.split('/');
            const formattedDateA = `${datePartsA[2]}-${datePartsA[1]}-${datePartsA[0]}T${a.message_heure}`;

            const datePartsB = b.message_date.split('/');
            const formattedDateB = `${datePartsB[2]}-${datePartsB[1]}-${datePartsB[0]}T${b.message_heure}`;

            const dateA = new Date(formattedDateA);
            const dateB = new Date(formattedDateB);
            return dateA - dateB;
        });
        setTitreForum(data.forum_information.forum_label);
        setDiscussions(sortedMessages);
        setIsOwner(data.forum_information.forum_id_utilisateur === id_utilisateur);
    }

    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        return `${hours}h${minutes}`;
    }




    useEffect(() => {
        fetchData();
    }, [id_forum, isClosed]);

    useEffect(() => {
        scrollToBottom();
    }, [discussions]);

    const handleChange = (e) => {
        setNewMessage(e.target.value);
    };

    const submitMessage = async (e) => {
        if (e.key === 'Enter' && newMessage.trim() !== '' && contenuRegex.test(e.target.value)) {
            e.preventDefault();
            try {
                await ajouterMessageForum(id_forum, newMessage);
                await fetchData();
                setNewMessage('');
            } catch (error) {
                console.error('Erreur lors de l\'envoi du message:', error);
            }
        } else if (e.key === 'Enter' && newMessage.trim() === '') {
            setErrorMessage('Votre message est vide!');
            setErrorAnchorEl(document.getElementById('input-message'));
            setId('error-popover');
            setOpen(true);
            return
        } else if (e.key === 'Enter' && !contenuRegex.test(e.target.value)) {
            setErrorMessage('Votre message contient des caractères non autorisés!');
            setErrorAnchorEl(document.getElementById('input-message'));
            setId('error-popover');
            setOpen(true);
            return
        }


    };

    const handleCloseForum = async () => {
        try {
            await closeForum(id_forum);
            alert('Forum clôturé');
            setIsClosed(true);
        } catch (error) {
            console.error('Erreur lors de la clôture du forum:', error);
        }
    };

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleClosePopover = () => {
        setErrorAnchorEl(null);
        setErrorMessage('');
        setOpen(false);
    };

    return (
        <div className='background-forum'>
            <div className='forum-container'>
                <div className='title-container'>
                    <h1 className='forum-title'>Forum : {titreForum} </h1>
                </div>
                <div className='forum-question-container' style={{ paddingBottom: isClosed ? '10px' : '100px' }}>
                    {discussions.map((post, index) => (
                        <div className="forum-question" key={post.id_message}>
                            <div className='question-head'>
                                <span className='who-when'>{`${post.nom} ${post.prenom} ( le ${post.message_date} à ${formatTime(post.message_heure)} )`}</span>
                            </div>
                            <div className={index % 2 === 1 ? 'question blue' : 'question grey'}>
                                <span className='question-text'>{post.message_contenu}</span>
                            </div>
                        </div>
                    ))}
                    <div ref={endOfMessagesRef} />
                </div>

                <div className='comment-footer' style={{ display: isClosed ? 'none' : 'flex' }}
                >
                    {isOwner && (
                        <StyledButton
                            width={'200px'}
                            content={"Cloturer"}
                            color={"primary"}
                            fontSize={"1.5em"}
                            onClick={handleCloseForum}
                        />
                    )}
                    <input
                        id='input-message'
                        className='input-forum'
                        placeholder='Nouveau message...'
                        onChange={handleChange}
                        onKeyDown={submitMessage}
                        value={newMessage}
                    />

                </div>
            </div>
            <Popover
                id={id}
                open={open}
                anchorEl={errorAnchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
            >
                <Typography sx={{ p: 2 }}>{errorMessage}</Typography>
            </Popover>
        </div>
    );
}

export default Forum;
