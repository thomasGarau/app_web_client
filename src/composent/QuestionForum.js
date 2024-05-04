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

    return (
        <div className='question-part'>
            <span className="forum-component-title">Forums</span>
            <List className='button-ul'>
                {forums.map(forum => (
                    <Button key={forum.id_forum} style={{ width: "100%" }} onClick={() => toForum(forum.id_forum)}>
                        <ListItem className="list-button" style={{ width: "100%" }}>
                            <ListItemText primaryTypographyProps={{ style: style }} primary={forum.forum[0].label} />
                        </ListItem>
                    </Button>
                ))}
            </List>
        </div>
    );
}

export default QuestionForum;
