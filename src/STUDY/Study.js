import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getRessourceParChap, addRessource, deleteRessourceApi, addCoursProgression } from '../API/RessourceAPI';
import './Study.css';
import { Accordion, AccordionSummary, Typography, AccordionActions, Box, Popover, Modal, } from '@mui/material';
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
import CommentIcon from '@mui/icons-material/Comment';
import AnnotationDrawer from '../annotation/AnnotationDrawer';
import AddAnnotationModal from '../annotation/AddAnnotationModal';
import { createFlashcard } from '../API/FlashcardsAPI';
import Annotation from '../annotation/Annotation';

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
    const [resourceIdAddAnnotation, setResourceIdAddAnnotation] = useState(null);
    const [drawerState, setDrawerState] = useState({
        isOpen: false,
        activeResourceId: null
    });
    const [sessionData, setSessionData] = useState({
        startTime: null,
        elapsedTime: 0,
    });
    const selectedAnnotation = useSelector(state => state.annotation.selectedAnnotation);
    const [openAddAnnotation, setOpenAddAnnotation] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

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


    const fetchRessources = useCallback(async () => {
        try {
            const response_info = await getUserInfo();
            setRole(response_info.role);
            const data = await getRessourceParChap(id);
            setRessources(data.cours);
        } catch (error) {
            console.error("Erreur lors de la récupération des ressources :", error);
        }
    }, [id]);

    const deleteRessource = useCallback(async (id_cours) => {
        try {
            await deleteRessourceApi(id_cours);
            await fetchRessources();
        } catch (error) {
            console.error("Erreur lors de la suppression de la ressource:", error);
        }
    }, []);

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

    const handleSaveFlashCard = async (question, reponse, visibilite) => {
        try {
            await createFlashcard(id, question, reponse, visibilite);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAnnotationUpdate = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleDrawerOpen = useCallback((resourceId) => {
        setDrawerState({
            isOpen: true,
            activeResourceId: resourceId
        });
    }, []);

    const handleDrawerClose = useCallback(() => {
        setDrawerState({
            isOpen: false,
            activeResourceId: null
        });
    }, [drawerState]);

    const addAnnotation = () => {
        setResourceIdAddAnnotation(drawerState.activeResourceId);
        handleDrawerClose();
        setOpenAddAnnotation(true);
    };

    useEffect(() => {
        fetchRessources();
    }, [fetchRessources]);

    const isVideoResource = useCallback((resource) => {
        return videoExtensions.includes(resource.type.split('.').pop().toLowerCase());
    }, []);

    const handleVideoInteraction = useCallback(async (resource, duration) => {
        const data = {
            id_cours: resource.id_cours,
            chapitre_id: parseInt(id),
            pause: pauseRef.current,
            duration,
            videoTime: videoTimeRef.current,
            progression: progressionRef.current
        };

        dispatch(setPause(0));
        dispatch(setTime(0));
    }, [id, dispatch]);

    const handleGeneralInteraction = useCallback(async (resource, duration) => {
        const data = {
            id_cours: resource.id_cours,
            chapitre_id: parseInt(id),
            clicks: clicRef.current,
            duration,
            scroll: scrollRef.current,
            progression: progressionRef.current
        };

        setClic(0);
        dispatch(setScroll(0));
        await recolteInteraction(data);
    }, [id, dispatch]);

    const handleAccordionChange = useCallback(async (index, ressource) => {
        if (expandedIndex === index) {
            try {
                const progression = 100;
                await addCoursProgression(ressource.id, progression);
            } catch (error) {
                console.error("Erreur lors de la mise à jour de la progression :", error);
            }
        }
        setExpandedIndex(prevIndex => (prevIndex === index ? -1 : index));
    }, [expandedIndex]);

    useEffect(() => {
        if (!currentRessource) return;

        const startTime = new Date();
        setSessionData(prev => ({ ...prev, startTime }));

        const sendData = async () => {
            const { token, role } = await getTokenAndRole();
            const tokenInfo = decodeJWT(token);

            if (tokenInfo.consentement !== 1) return;

            try {
                const dureeSession = new Date() - sessionData.startTime;

                if (isVideoResource(currentRessource)) {
                    await handleVideoInteraction(currentRessource, dureeSession);
                } else {
                    await handleGeneralInteraction(currentRessource, dureeSession);
                }
            } catch (error) {
                console.error("Erreur lors de la récolte des données:", error);
            }
        };

        const interval = setInterval(sendData, 180000);

        return () => {
            clearInterval(interval);
            sendData().catch(console.error);
        };
    }, [currentRessource, id]);

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
                <AnnotationDrawer
                    parentType={'Study'}
                    open={drawerState.isOpen}
                    onClose={handleDrawerClose}
                    addAnnotation={addAnnotation}
                    resourceId={drawerState.activeResourceId}
                />
                <div className='text-part'>

                    <h1 className='study-title'>Ressource du chapitre</h1>
                    {ressources.length > 0 ? (
                        ressources.map((ressource, index) => (
                            <Accordion
                                key={ressource.id}
                                expanded={expandedIndex === index}
                                onChange={() => handleAccordionChange(index, ressource)}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                                    <Typography>{ressource.label}</Typography>
                                </AccordionSummary>
                                <ResourceDisplay ressource={ressource} />

                                <AccordionActions sx={{ display: 'flex' }}>
                                    {role === 'enseignant' && (
                                        <div className='icon-study' onClick={() => deleteRessource(ressource.id)}>
                                            <DeleteIcon />
                                        </div>
                                    )}
                                    <div className='icon-study' onClick={() => window.open(ressourceImg.url, '_blank')}>
                                        <DownloadIcon />
                                    </div>
                                    <div className='icon-study' onClick={(e) => {
                                        handleDrawerOpen(ressource.id);
                                    }} >
                                        <CommentIcon />
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
                <AddAnnotationModal parentType="Study" open={openAddAnnotation} handleClose={() => setOpenAddAnnotation(false)} resourceId={resourceIdAddAnnotation} />
                {selectedAnnotation && (<Annotation  />)}
                <QuestionForum id_chap={id} role={role} />
            </div>
        </div>
    );
}

export default Study;
