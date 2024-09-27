import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormControl, MenuItem, Select, Box, Typography, Popover } from "@mui/material";
import StyledButton from '../composent/StyledBouton';
import { addForumRessource, addForumQuizz, addForumCours } from '../API/ForumAPI';
import { getRessourceParChap } from '../API/RessourceAPI';
import { getQuizzInfo } from '../API/QuizzAPI';
import { contenuRegex } from '../services/Regex';

const CreateForum = () => {
    const navigate = useNavigate();
    const params = useParams();
    const id_chap = params.id_chap;
    const id_quizz = params.id_quizz;
    const [contenu, setContenu] = useState('');
    const [sujet, setSujet] = useState('');
    const [entityId, setEntityId] = useState('');
    const [entities, setEntities] = useState([]);
    const [errorAnchorEl, setErrorAnchorEl] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [id, setId] = useState(undefined);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (id_chap) {
            getRessourceParChap(id_chap).then(data => {
                setEntityId(data[0].id_cours);
                setEntities(data);
            }).catch(error => console.error("Erreur lors de la récupération des cours :", error));
        } else if (id_quizz) {
            getQuizzInfo(id_quizz).then(data => {
                setEntityId(data.id_quizz);
                setEntities([data]);
            }).catch(error => console.error("Erreur lors de la récupération des quiz :", error));
        }
    }, [id_chap, id_quizz]);

    const handleCreateForum = async () => {

        if (sujet.trim() === '') {
            setErrorMessage('Ce champ est requis!');
            setErrorAnchorEl(document.getElementById('sujet'));
            setId('error-popover');
            setOpen(true);
            return;
        } else if (!contenuRegex.test(sujet)) { // Utilisation de la regex importée
            setErrorMessage('Caractère non autorisé. (Chiffre non autorisé)');
            setErrorAnchorEl(document.getElementById('sujet'));
            setId('error-popover');
            setOpen(true);
            return;
        }
        if (contenu.trim() === '') {
            setErrorMessage('Ce champ est requis!');
            setErrorAnchorEl(document.getElementById('contenu'));
            setId('error-popover');
            setOpen(true);
            return;
        } else if (!contenuRegex.test(contenu)) { // Utilisation de la regex importée
            setErrorMessage('Caractère non autorisé. (Chiffre non autorisé)');
            setErrorAnchorEl(document.getElementById('contenu'));
            setId('error-popover');
            setOpen(true);
            return;
        }

        try {
            if (id_chap) {
                const response = await addForumCours(sujet, contenu, entityId);
                const id_forum = response.id_forum;
                navigate(`/forum/${id_forum}`);
                
            } else if (id_quizz) {
                const response = await addForumQuizz(sujet, contenu, entityId);
                const id_forum = response.id_forum;
                navigate(`/forum/${id_forum}`);
            }
            
        } catch (error) {
            console.error("Erreur lors de la création du forum :", error);
            setErrorMessage('Erreur lors de la création du forum. Veuillez réessayer.');
            setErrorAnchorEl(document.getElementById('sujet'));
            setId('error-popover');
            setOpen(true);
        }
    };


    const handleClosePopover = () => {
        setErrorAnchorEl(null);
        setErrorMessage('');
        setOpen(false);
    };

    const handleChangeContenu = (e) => {
        const value = e.target.value;
        if (value.length > 300) {
          setErrorMessage('Limite de caractère dépassée.');
          setErrorAnchorEl(document.getElementById('contenu'));
          setId('error-popover');
          setOpen(true);
          return;
        }
        setContenu(value);
      };
      

    return (
        <div className='create-forum-container'>
            <h2>Poser une question</h2>
            <div className='create-forum-form-container'>
                <div className='create-forum-form'>
                    <FormControl
                        className='form-control'
                        sx={{ m: 1, width: "80%" }} >

                        <Box display="flex" alignItems="center" width="100%">
                        <Typography
                            sx={{
                                mr: 1,
                                width: "45%",
                                color: 'white',
                                fontSize: {
                                    xs: "1em",
                                    sm: "1.5em",
                                    md: "2em"
                                }
                            }}>
                            {id_quizz ? "Quiz concerné :" : "Ressource concernés :"}
                        </Typography>
                        <Select
                            id='entity_id'
                            value={entityId}
                            onChange={(e) => setEntityId(e.target.value)}
                            sx={{
                                width: "55%",
                                borderRadius: "10px",
                                backgroundColor: "#f0f0f0"
                            }}
                        >
                            {entities.map(entity => (
                                <MenuItem key={entity.id_cours || entity.id_quizz} value={entity.id_cours || entity.id_quizz}>
                                    {entity.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>


                        <Box display="flex" alignItems="center" width="100%">
                            <Typography
                                sx={{
                                    mr: 1,
                                    width: "45%",
                                    color: 'white',
                                    fontSize: {
                                        xs: "1em",
                                        sm: "1.5em",
                                        md: "2em"
                                    }
                                }}
                                className='create-forum-typography'>
                                Sujet :
                            </Typography>
                            <input
                                aria-describedby={id}
                                type="text"
                                id='sujet'
                                className='form-input'
                                value={sujet}
                                onChange={(e) => setSujet(e.target.value)}
                            />

                        </Box>
                        <Box display="flex" alignItems="center" width="100%">
                            <Typography sx={{
                                mr: 1,
                                width: "45%",
                                color: 'white',
                                fontSize: {
                                    xs: "1em",
                                    sm: "1.5em",
                                    md: "2em"
                                }
                            }}
                                className='create-forum-typography'>
                                Question :
                            </Typography>
                            <textarea
                                aria-describedby={id}
                                id='contenu'
                                className='form-textarea'
                                value={contenu}
                                onChange={handleChangeContenu}
                                sx={{
                                    width: {
                                        xs: "100%",  // Plus large sur les petits écrans pour une meilleure accessibilité
                                        sm: "100%",
                                        md: "80%"    // Plus étroit sur les écrans larges
                                    },
                                    fontSize: {
                                        xs: "0.8em",  // Plus petite taille de police sur les petits écrans
                                        sm: "1.2em",
                                        md: "1.5em"   // Taille normale sur les écrans plus larges
                                    },
                                    borderRadius: "20px",
                                    padding: "5px",
                                    border: "1px solid #ccc"
                                }}
                            />
                        </Box>
                        <Box display="flex" alignItems="center" width="100%" justifyContent="center">
                            <StyledButton
                                width={'175px'}
                                content={"Créer le forum"}
                                fontSize={"1em"}
                                onClick={handleCreateForum}
                            />
                        </Box>
                    </FormControl>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={errorAnchorEl}
                        onClose={handleClosePopover}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <Typography sx={{ p: 2 }}>{errorMessage}</Typography>
                    </Popover>
                </div>
            </div>
        </div>
    );
};

export default CreateForum;
