import { Button, List, ListItem, ListItemText, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import {getForumByCours } from "../composent/QuestionAPI.js";
import { useNavigate } from 'react-router-dom';

function QuestionForum({ courseId }) {
    const [forums, setForums] = useState([]);  // Renommé pour clarifier qu'il s'agit de forums
    const style = {
        fontFamily: "Nanum Pen Script",
        fontSize: "1em",
    };
    const navigate = useNavigate();

    useEffect(() => {
        const fetchForums = async () => {
            try {
                const data = await getForumByCours(courseId);
                const flattenedForums = data.flatMap(item => item.forum); // Aplatit le tableau de forums
                setForums(flattenedForums);
            } catch (error) {
                console.error("Erreur lors de la récupération des forums :", error);
            }
        };

        if (courseId) {
            fetchForums();
        }
    }, [courseId]);

    const toForum = (forumId) => {
        navigate(`/forum/${forumId}`);
    }

    return (
        <div className='question-part'>
            <span className="forum-component-title">Forum</span>
            <List className='button-ul'>
                {forums.map(forum => (
                    <Button key={forum.id_forum} style={{ width: "100%" }} onClick={() => toForum(forum.id_forum)}>
                        {window.visualViewport.width <= 600 ? 
                            <ListItem className="list-button" style={{ width: "100%" }}>
                                <Typography style={style}>{forum.label}</Typography>
                            </ListItem> : 
                            <ListItem className="list-button" style={{ width: "100%" }}>
                                <ListItemText primaryTypographyProps={{ style: style }} primary={forum.label} />
                            </ListItem>
                        }
                    </Button>
                ))}
            </List>
        </div>
    );
}

export default QuestionForum;
