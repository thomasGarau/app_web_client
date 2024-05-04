import { Button, List, ListItem, ListItemText } from "@mui/material";
import React, { useState, useEffect } from "react";

import { getForumByCours } from "../composent/QuestionAPI.js";
import { useNavigate } from 'react-router-dom';

function QuestionForum({ id_chap }) {
    const [forums, setForums] = useState([]);
    const style = {
        fontSize: "1em",
    };
    const navigate = useNavigate();

    useEffect(() => {
        const fetchForums = async () => {
            try {
                const data = await getForumByCours(id_chap);
                setForums(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des forums :", error);
            }
        };

        if (id_chap) {
            fetchForums();
        }
    }, [id_chap]);

    const toForum = (forumId) => {
        navigate(`/forum/${forumId}`);
    }
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
        return formattedDate;
    }

    return (
        <div className='question-part'>
            <span className="forum-component-title">Forums</span>
            <Button className="button" onClick={() => navigate(`/create-forum/${id_chap}`)}>Poser une question</Button>
            <List className='button-ul'>
                {forums.map(forum => (
                    <Button key={forum.id_forum} style={{ width: "100%" }} onClick={() => toForum(forum.id_forum)}>
                        <ListItem className="list-button" style={{ width: "100%" }}>
                            <ListItemText primaryTypographyProps={{ style: style }} primary={forum.forum[0].label} />
                        </ListItem>
                        <ListItem className="list-button" style={{ width: "100%" }}>
                            <ListItemText primaryTypographyProps={{ style: style }} primary={forum.forum[0].id_utilisateur} />
                        </ListItem>
                        <ListItem className="list-button" style={{ width: "100%" }}>
                            <ListItemText primaryTypographyProps={{ style: style }} primary={formatDate(forum.forum[0].date)} />
                        </ListItem>
                        <ListItem className="list-button" style={{ width: "100%" }}>
                            <ListItemText primaryTypographyProps={{ style: style }} primary={forum.forum[0].etat} />
                        </ListItem>
                    </Button>
                ))}
            </List>
        </div>
    );
}

export default QuestionForum;
