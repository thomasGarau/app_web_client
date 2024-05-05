import { Button, List, ListItem, ListItemText, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";

import { getForumByCours } from "../composent/QuestionAPI.js";
import { useNavigate } from 'react-router-dom';

function QuestionForum({ id_chap }) {
    const [forums, setForums] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const style = {
        fontSize: "1em",
    };
    const navigate = useNavigate();

    useEffect(() => {
        const fetchForums = async () => {
            setIsLoading(true);
            try {
                const data = await getForumByCours(id_chap);
                if (Array.isArray(data)) { // Vérifier si data est un tableau
                    setForums(data);
                } else {
                    console.error("Les données récupérées ne sont pas un tableau.");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des forums :", error);
            }
            setIsLoading(false);
        };

        if (id_chap) {
            fetchForums();
        }
    }, [id_chap]);


    const toForum = (forumId) => {
        navigate(`/forum/${forumId}`);
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
        return formattedDate;
    }

    const getForumStatus = (etat) => {
        return etat === "1" ? "Ouvert" : "Fermé";
    };

    if (isLoading) {
        return <div>Loading...</div>; // Ou un composant de chargement plus élaboré
    }

    return (
        <div className='question-part'>
            <Typography variant="h3" className="forum-component-title">Forums</Typography>
            <Button className="button" onClick={() => navigate(`/create-forum/${id_chap}`)}>Poser une question</Button>
            <List className='button-ul'>
                {forums.length > 0 ? (
                    forums.map(forum => (
                        <Button key={forum.id_forum} style={{ width: "100%" }} onClick={() => toForum(forum.id_forum)}>
                            <ListItem className="list-button" style={{ width: "100%" }}>
                                <ListItemText primaryTypographyProps={{ style }} primary={forum.label} />
                            </ListItem>
                            <ListItem className="list-button" style={{ width: "100%" }}>
                                <ListItemText primaryTypographyProps={{ style }} primary={`${forum.nom} ${forum.prenom}`} />
                            </ListItem>
                            <ListItem className="list-button" style={{ width: "100%" }}>
                                <ListItemText primaryTypographyProps={{ style }} primary={forum ? formatDate(forum.date) : 'N/A'} />
                            </ListItem>
                            <ListItem className="list-button" style={{ width: "100%" }}>
                                <ListItemText primaryTypographyProps={{ style }} primary={getForumStatus(forum.etat)} />
                            </ListItem>
                        </Button>
                    ))
                ) : (
                    <Typography variant="subtitle1">Aucun forum à afficher</Typography>
                )}
            </List>
        </div>
    );
}

export default QuestionForum;
