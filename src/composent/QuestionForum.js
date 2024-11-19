import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, List, ListItem, ListItemText, Typography } from "@mui/material";
import StyledButton from '../composent/StyledBouton';
import { getForumByCours, getForumByQuizz } from "../API/ForumAPI.js";

function QuestionForum(props) {
    const { id_chap, id_quizz, role } = props;
    const [forums, setForums] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const style = {
        fontSize: "1em",
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                let data;
                if (id_chap) {
                    data = await getForumByCours(id_chap);
                } else if (id_quizz) {
                    data = await getForumByQuizz(id_quizz);
                }
                if (data === null || data === undefined) return;
                const sortedForums = data.sort((a, b) => {
                    if (a.etat === "0" && b.etat === "1") return 1;
                    if (a.etat === "1" && b.etat === "0") return -1;

                    // Si les états sont identiques, comparer par date (les plus récents en premier)
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateB - dateA; // Tri décroissant par date
                });

                setForums(sortedForums);
            } catch (error) {
                console.error("Erreur lors de la récupération des forums :", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id_chap, id_quizz]);


    const toForum = (forumId) => {
        navigate(`/forum/${forumId}`);
    }

    const handleCreateForum = () => {
        const createPath = id_chap ? `/forum/chap/${id_chap}` : `/forum/quizz/${id_quizz}`;
        navigate(createPath);
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
        return <div>Loading...</div>;
    }

    return (
        <div className='question-part'>
            <div className="question-title-button" style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0px",
                paddingTop: "10px",
                alignItems: "center",
                borderTop: "2vh solid #d9d9d9",
            }} >
                <Typography variant="h3" className="forum-component-title">Forums</Typography>
                {role === "etudiant" && (
                    <StyledButton
                        width={'175px'}
                        content={"Poser une question"}
                        color={"primary"}
                        fontSize={"1.2em"}
                        onClick={handleCreateForum}
                    />)}
            </div>
            <List className='button-ul'>
                {forums.length > 0 ? (
                    forums.map(forum => (
                        <Button key={forum.id_forum} sx={{ width: "100%" }} onClick={() => toForum(forum.id_forum)}>
                            <ListItem className="list-button"
                                sx={{
                                    width: "25%",
                                    padding: "2px",
                                    fontSize: {
                                        xs: "0.8em",
                                        sm: "1em",
                                        md: "1.2em"
                                    }
                                }}>
                                <ListItemText primaryTypographyProps={{
                                    fontSize: "1em",
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",  
                                    whiteSpace: "nowrap", 
                                    width: "100%" 
                                }} primary={forum.label || 'N/A'} />
                            </ListItem>
                            <ListItem className="list-button"
                                sx={{
                                    width: "25%",
                                    padding: "2px",
                                    fontSize: {
                                        xs: "0.8em",
                                        sm: "1em",
                                        md: "1.2em"
                                    }
                                }}>
                                <ListItemText primaryTypographyProps={{ fontSize: "1em" }} primary={`${forum.nom} ${forum.prenom}`} />
                            </ListItem>
                            <ListItem className="list-button"
                                sx={{
                                    width: "25%",
                                    padding: "2px",
                                    fontSize: {
                                        xs: "0.8em",
                                        sm: "1em",
                                        md: "1.2em"
                                    }
                                }}>
                                <ListItemText primaryTypographyProps={{ fontSize: "1em" }} primary={forum ? formatDate(forum.date) : 'N/A'} />
                            </ListItem>
                            <ListItem className="list-button"
                                sx={{
                                    width: "25%",
                                    padding: "2px",
                                    fontSize: {
                                        xs: "0.8em",
                                        sm: "1em",
                                        md: "1.2em"
                                    }
                                }}>
                                <ListItemText primaryTypographyProps={{ fontSize: "1em" }} primary={getForumStatus(forum.etat)} />
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
