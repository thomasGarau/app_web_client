import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getRessourceParChap, addRessource, editRessource, deleteRessourceApi, getRessourceById, addCoursProgression } from '../API/RessourceAPI';
import './Study.css';
import { Accordion, AccordionSummary, AccordionDetails, Typography, AccordionActions, Box, Popover, TextField, Modal, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadIcon from '@mui/icons-material/Download';
import QuestionForum from '../composent/QuestionForum';
import { getUserInfo } from '../API/ProfileAPI';
import StyledButton from '../composent/StyledBouton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { decodeJWT } from '../services/decode';
import { getTokenAndRole } from '../services/Cookie';
import useErrorPopover from '../composent/useErrorPopover';
import PopoverError from '../composent/PopoverError';
import { recolteInteraction } from '../API/jMethodeAPI';
import { useDispatch, useSelector } from 'react-redux';
import ResourceDisplay from './RessourcePlayer';
import { setScroll } from '../Slice/pdfViewerSlice';
import { setPause, setTime } from '../Slice/videoSlice';
import FlashCardDrawer from './FlashcardsDrawer';

const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];

const style = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '80%', sm: '70%', md: '60%' },
    bgcolor: 'background.paper',
    border: '2px solid #133D56',
    boxShadow: 24,
    borderRadius: 2,
    Typography: 4,
    height: '60vh',
    minHeight: '500px'
};

function Study() {
    const [ressources, setRessources] = useState([]);
    const { id } = useParams();
    const [clic, setClic] = useState(0);
    const [role, setRole] = useState('');
    const [open, setOpen] = useState(false);
    const [currentRessource, setCurrentRessource] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isAdding, setIsAdding] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const [expandedIndex, setExpandedIndex] = useState(-1);
    const { errorMessage, errorAnchorEl, idEl, openAnchor, showErrorPopover, handleClosePopover } = useErrorPopover();
    const [isFlashcardOpen, setFlashcardOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const scroll = useSelector((state) => state.pdfViewer.scroll);
    const progression = useSelector((state) => state.pdfViewer.progression);
    const pause = useSelector((state) => state.video.pause);
    const videoTime = useSelector((state) => state.video.time);
    const dispatch = useDispatch();

    const progressionRef = useRef(progression);
    const scrollRef = useRef(scroll);
    const clicRef = useRef(clic);
    const elapsedTimeRef = useRef(elapsedTime);
    const startTimeRef = useRef(null);
    const videoTimeRef = useRef(videoTime);
    const pauseRef = useRef(pause);

    const ressourcePdf = { type: 'pdf', url: '/demo.pdf' }
    const ressourceMp4 = { type: 'video', url: '/test.mp4' }
    const ressourceYt = { type: 'video', url: 'https://www.youtube.com/watch?v=5YIyTF7izJk' }
    const ressourceImg = { type: 'img', url: '/logo_rond.png' }


    const fetchRessources = async () => {
        try {
            const response_info = await getUserInfo();
            setRole(response_info.role);
            const data = await getRessourceParChap(id);
            setRessources(data.cours);
            console.log(ressources, id)
        } catch (error) {
            console.error("Erreur lors de la récupération des ressources :", error);
        }
    };

    const deleteRessource = (id_cours) => {
        try {
            deleteRessourceApi(id_cours);
            fetchRessources();
        } catch (error) {
            console.error("Erreur lors de la suppression du ressources :", error);
        }
    }

    const handleCloseAdd = () => {
        setIsAdding(false);
    };

    const incrementerClic = () => {
        setClic(prevClic => prevClic + 1);
    };

    const validateRessourceAdd = () => {
        if (fileList.length == 0) {
            showErrorPopover('Vous devez avoir ajouter au moins une ressource!', 'sujet');
            return false;
        }

        return true;
    };


    const handleAddResources = async () => {
        if (validateRessourceAdd()) {

            fileList.forEach(async (file) => {
                try {
                    console.log(file)
                    await addRessource(file, file.name, parseInt(id));
                } catch (error) {
                    console.error("Erreur lors de la création de la ressource :", error);
                    showErrorPopover(`Erreur lors de la création de la ressource ${file.name}. Veuillez réessayer.`, 'sujet-add');
                }
            });
            fetchRessources();
            handleCloseAdd();
            setFileList([]);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        setFileList(prevFiles => [...prevFiles, ...files]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleFileInputClick = () => {
        fileInputRef.current.click();
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setFileList(prevFiles => [...prevFiles, ...files]);
    };

    const handleCancel = () => {
        setFileList([]);
        setIsAdding(false);
    };

    const handleSaveFlashCard = (flashCard) => {
        // Logique pour enregistrer la flashcard
        console.log('Flashcard enregistrée:', flashCard);
        // Ici, tu peux appeler une API pour sauvegarder la flashcard
    };

    const handleToggleFlashcard = () => {
        setFlashcardOpen(prev => !prev);
    };

    useEffect(() => {
        fetchRessources();
    }, [id]);

    useEffect(() => {
        startTimeRef.current = new Date();

        const sendData = async () => {
            const { token, role } = await getTokenAndRole();
            const tokenInfo = decodeJWT(token);
            if (tokenInfo.consentement === 1) {
                setElapsedTime(new Date());
                try {
                    const dureeSession = new Date() - startTimeRef.current;
                    if (videoExtensions.includes(currentRessource.type.split('.').pop().toLowerCase())) {
                        // await recolteInteractionVideo(currentRessource.id_cours, parseInt(id), pauseRef.current, dureeSession, videoTimeRef.current, progressionRef.current);
                        dispatch(setPause(0))
                        dispatch(setTime(0))
                    } else {
                        await recolteInteraction(currentRessource.id_cours, parseInt(id), clicRef.current, dureeSession, scrollRef.current, progressionRef.current);
                        setClic(0);
                        dispatch(setScroll(0));
                    }
                    setElapsedTime(0);
                } catch (error) {
                    console.error("Erreur lors de la récolte des données:", error);
                }
            };
            const interval = setInterval(sendData, 180000);
            if (currentRessource === null) {
                clearInterval(interval);
            }

            return () => clearInterval(interval);
        }
    }, [currentRessource, id]);

    const handleAccordionChange = async (index, ressource) => {
        if (expandedIndex === index) {
            try {
                const progression = 100;
                await addCoursProgression(ressource.id, progression);
                console.log(`Progression pour ${ressource.id} mise à jour à ${progression}%`);
            } catch (error) {
                console.error("Erreur lors de la mise à jour de la progression :", error);
            }
        }

        // Ouvrir/fermer l'Accordion
        setExpandedIndex(prevIndex => (prevIndex === index ? -1 : index));
    };


    /*     useEffect(() => {
            if (currentRessource) {
                if (videoExtensions.includes(currentRessource.type.split('.').pop().toLowerCase())) {
                    pauseRef.current = pause;
                    videoTimeRef.current = videoTime;
                }
                else {
                    clicRef.current = clic;
                    scrollRef.current = scroll;
                }
                elapsedTimeRef.current = elapsedTime;
                progressionRef.current = progression;
            }
    
        }, [clic, elapsedTime, scroll, progression, pause, videoTime]); */

    return (
        <div className='background-study'>
            <div className='sub_container_text_question'>

                <div className='text-part'>
                
                    <h1 className='study-title'>Ressource du chapitre</h1>
                    {ressources.length > 0 ? (
                        ressources.map((ressource, index) => (
                            <Accordion
                                key={ressource.id}
                                expanded={expandedIndex === index} // Vérifier si cet Accordion est ouvert
                                onChange={() => handleAccordionChange(index, ressource)} // Mettre à jour l'état lors du changement
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                                    <Typography>{ressource.label}</Typography>
                                </AccordionSummary>

                                {/* Affichage de la ressource dynamique */}
                                <ResourceDisplay ressource={ressource} />

                                <AccordionActions>
                                    <div>
                                        {role === 'enseignant' && (
                                            <div className='icon-study' onClick={() => deleteRessource(ressource.id)}>
                                                <DeleteIcon />
                                            </div>
                                        )}
                                        <div className='icon-study' onClick={() => window.open(ressourceImg.url, '_blank')}>
                                            <DownloadIcon />
                                        </div>
                                    </div>
                                </AccordionActions>
                            </Accordion>
                        ))
                    ) : (
                        <p>Aucune ressource disponible pour ce chapitre.</p>
                    )}
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
                {role === 'enseignant' && !isAdding && (
                    <StyledButton
                        content={"Ajouter une ressource"}
                        width={300}
                        color={"primary"}
                        onClick={() => setIsAdding(true)}
                    />
                )}
                {role === 'enseignant' && isAdding && (
                    <Modal
                        open={isAdding}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style} onDrop={handleDrop} onDragOver={handleDragOver}>
                            <Typography variant="h6" textAlign="center" mb={2}>
                                Glissez et déposez vos fichiers ici, ou cliquez pour sélectionner
                            </Typography>

                            <Box
                                sx={{
                                    border: isDragging ? '2px dashed #1976d2' : '2px dashed #ccc',
                                    padding: '20px',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    width: '95%',
                                    height: '200px',
                                    overflowY: 'auto',
                                    textAlign: 'center',
                                    bgcolor: isDragging ? '#f0f8ff' : 'background.paper',
                                }}
                                onClick={handleFileInputClick}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    style={{ display: 'none' }}
                                    multiple
                                    onChange={handleFileUpload}
                                />
                                {!fileList.length && (
                                    <Typography variant="body1">
                                        Glissez vos fichiers ici ou cliquez pour sélectionner
                                    </Typography>
                                )}
                                {fileList.map((file, index) => (
                                    <Typography key={index} variant="body2">
                                        {file.name} ({(file.size / 1024).toFixed(2)} KB)
                                    </Typography>
                                ))}
                            </Box>
                            <Box mt={3} textAlign="center">
                                <StyledButton
                                    content={"Ajouter les ressources"}
                                    width={300}
                                    color={"primary"}
                                    onClick={handleAddResources}
                                />
                                <StyledButton
                                    content={"Annuler"}
                                    width={300}
                                    color={"secondary"}
                                    onClick={handleCancel}
                                    sx={{ mt: 2 }}
                                />
                            </Box>
                            <PopoverError
                                id={idEl}
                                open={openAnchor}
                                anchorEl={errorAnchorEl}
                                onClose={handleClosePopover}
                                errorMessage={errorMessage}
                            />
                        </Box>
                    </Modal>

                )}
                <FlashCardDrawer open={isFlashcardOpen} onClose={() => setFlashcardOpen(false)} onSave={handleSaveFlashCard} />
                <QuestionForum id_chap={id} role={role} />
            </div>
        </div>
    );
}

export default Study;
