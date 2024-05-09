import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChapParUE, ueInfo, addChapitre, updateChapitre, deleteChapitre } from './UeAPI.js';
import './Ue.css'; // Assurez-vous que le chemin est correct pour vos styles
import StyledButton from '../composent/StyledBouton.js';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { Accordion, AccordionSummary, AccordionDetails, Typography, AccordionActions, Box, Popover, TextField } from '@mui/material';

function UeProf() {
    const [chapters, setChapters] = useState([]);
    const { id } = useParams();
    const [label, setLabel] = useState(''); // Ajout d'un état pour stocker le label de l'UE [1/2
    const navigate = useNavigate(); 
    const [isAdding, setIAdding] = useState(false); 
    const [editChapterId, setEditChapterId] = useState(null);
    const [isEditing, setIsEditing] = useState(false); 
    const [nom, setNom] = useState('');
    const [open, setOpen] = useState(false);
    
    const [errorAnchorEl, setErrorAnchorEl] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');


    const fetchChapters = async () => {
        try {
            const chaptersData = await getChapParUE(id);
            setChapters(chaptersData);
            const ueData = await ueInfo(id); 
            setLabel(ueData[0].label); 
        } catch (error) {
            console.error("Failed to fetch chapters:", error);
        }
    };

    useEffect(() => {
        
        fetchChapters();
    }, [id]);

    const validateChapInputs = (label) => {
        if (label.trim() === '') {
            setErrorMessage('Le nom du chapitre est requis!');
            setErrorAnchorEl(document.getElementById('nom'));
            setOpen(true);
            return false;
        } else if (!/^[a-zA-ZÀ-ÿ\s-]*$/.test(label)) {
            setErrorMessage('Caractère non autorisé. (Chiffre non autorisé)');
            setErrorAnchorEl(document.getElementById('nom'));
            setOpen(true);
            return false;
        }

        return true;
    };
    
    const handleQuizClick = (chapterId) => {
        navigate(`/gestion_quizz/prof/${chapterId}`);
    };

    const handleCourseClick = (chapterId) => {
        navigate(`/etude/${chapterId}`);
    };

    const handleAddChapitre = () => {
        setIAdding(true);
    }

    const handleClosePopover = () => {
        setErrorAnchorEl(null);
        setErrorMessage('');
        setOpen(false);
    };

    const editChap = (chapterId) => {
        setIsEditing(true);
        setEditChapterId(chapterId);
        const chap = chapters.find(chap => chap.id_chapitre === chapterId);
        setNom(chap.label);
    };

    

    const handleEditChapter = async (chapterId) => {
        if(validateChapInputs(nom)) {
            try {
                await updateChapitre(chapterId, nom); // Assumer que `updateChapitre` est une API pour mettre à jour un chapitre
                setIsEditing(false);
                setEditChapterId('');
                setNom('');
                fetchChapters();
            } catch (error) {
                console.error("Erreur lors de la mise à jour du chapitre :", error);
                setErrorMessage('Erreur lors de la mise à jour du chapitre. Veuillez réessayer.');
                setErrorAnchorEl(document.getElementById('nom'));
                setOpen(true);
            }
        }
    };
    

    const deleteChap = (chapterId) => {
        try{
            deleteChapitre(chapterId);
            fetchChapters();
        }
        catch (error) {
            console.error("Erreur lors de la suppression du chapitre :", error);
        }
    };

    const handleCreateChap = async () => {
        if(validateChapInputs(nom)) {
            try {
                await addChapitre(nom, id);
                setIAdding(false);
                setNom('');
                fetchChapters();
            }
            catch (error) {
                console.error("Erreur lors de la création du chapitre :", error);
                setErrorMessage('Erreur lors de la création du chapitre. Veuillez réessayer.');
                setErrorAnchorEl(document.getElementById('nom'));
                setOpen(true);
            }
        }
    }

    return (
        <div className='background-ue-prof'>
            <div className='container-ue-prof'>
                <h1>UE {label}</h1>
                <div className="container-home-prof-ue">
                    <div className='container-chap-chap-ue-prof'>
                        {chapters.length > 0 ? (
                            chapters.map((chapter) => (
                                <div className='container-chap-ue-prof' key={chapter.id_chapitre}>
                                    <div className='contenant-bouton-chap'>
                                        {editChapterId != chapter.id_chapitre && (
                                        <h4>{chapter.label}</h4>
                                        )}
                                        {editChapterId === chapter.id_chapitre ? (
                                                <div className='icon-study' onClick={() => handleEditChapter(chapter.id_chapitre)}> <SaveIcon /></div>
                                            ) : (
                                                <div>
                                                   <div className='icon-study' onClick={() => editChap(chapter.id_chapitre)}> <EditIcon /></div>
                                                    <div className='icon-study' onClick={() => deleteChap(chapter.id_chapitre)}><DeleteIcon /></div>
                                                </div>
                                            )}
                                        
                                    </div>
                                    {isEditing && editChapterId === chapter.id_chapitre ? (
                                         <div className='edit-chapitre-form'>
                                            <TextField
                                                fullWidth
                                                label="Nom du chapitre"
                                                variant="outlined"
                                                id='nom'
                                                sx={{
                                                    paddingBottom: '10px'
                                                }}
                                                value={nom}
                                                onChange={(e) => setNom(e.target.value)}
                                            />   
                                            
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
                                    ) : (
                                        <div>
                                            <p className="link-style" onClick={() => handleQuizClick(chapter.id_chapitre)}>Quizz du chap {chapter.label}</p>
                                            <p className="link-style" onClick={() => handleCourseClick(chapter.id_chapitre)}>Cours du chap {chapter.label}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>Aucun chapitre disponible pour cette UE.</p>
                        )}
                    </div>
                </div>
                {!isAdding && (
                    <StyledButton height={50} color={"primary"} onClick={handleAddChapitre} content={"Ajouter un chapitre"} />
                )}  
                {isAdding && (
                    <div className='create-chapitre-form'>
                        <Box display="flex" flexWrap="wrap" alignItems="center" width="50%" padding="10px">
                        <Typography
                            sx={{
                                mr: 1,
                                width: "40%",
                                color: 'black',
                                fontSize: {
                                    xs: "0.5em",
                                    sm: "0.8em",
                                    md: "1.0em"
                                }
                            }}
                            className='create-forum-typography'>
                            Nom du chapitre :
                        </Typography>
                        <input
                            aria-describedby={id}
                            type="text"
                            id='nom'
                            className='form-input'
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                        />

                        </Box>
                            <StyledButton
                            content={"Ajouter"}
                            width={200}
                            color={"primary"}
                            onClick={handleCreateChap}
                        />
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
                )}
            </div>
        </div>
    );
}

export default UeProf;
