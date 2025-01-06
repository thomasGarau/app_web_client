import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getRessourceParChap, addRessource, deleteRessourceApi, getChapitreById, addCoursProgression } from '../API/RessourceAPI';
import './Study.css';
import { Accordion, AccordionSummary, Typography, AccordionActions, Box, Popover, Modal, LinearProgress, } from '@mui/material';
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
import ResourceDisplay from './ResourceDisplay';
import { setAllProgressions, setProgression } from '../Slice/progressionSlice';
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

function LinearProgressWithLabel(prop) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...prop} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {`${Math.round(prop.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}


function Study() {
    const [ressources, setRessources] = useState([]);
    const { id } = useParams();
    const [clic, setClic] = useState(0);
    const [role, setRole] = useState('');
    const [open, setOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const [expandedIndex, setExpandedIndex] = useState(-1);
    const { errorMessage, errorAnchorEl, idEl, openAnchor, showErrorPopover, handleClosePopover } = useErrorPopover();
    const [isFlashcardOpen, setFlashcardOpen] = useState(false);
    const [chapterProgress, setChapterProgress] = useState(0);
    const [resourceIdAddAnnotation, setResourceIdAddAnnotation] = useState(null);
    const [ChapterName, setChapterName] = useState('');
    const [drawerState, setDrawerState] = useState({
        isOpen: false,
        activeResourceId: null
    });
    const selectedAnnotation = useSelector(state => state.annotation.selectedAnnotation);
    const [openAddAnnotation, setOpenAddAnnotation] = useState(false);

    const pause = useSelector((state) => state.video.pause);
    const videoTime = useSelector((state) => state.video.time);
    const progressions = useSelector((state) => state.progression.progressions);
    const dispatch = useDispatch();

    const clicRef = useRef(clic);

    const videoTimeRef = useRef(videoTime);
    const pauseRef = useRef(pause);

    const ressourcePdf = { type: 'pdf', url: '/demo.pdf' }
    const ressourceMp4 = { type: 'video', url: '/test.mp4' }
    const ressourceYt = { type: 'video', url: 'https://www.youtube.com/watch?v=5YIyTF7izJk' }
    const ressourceImg = { type: 'img', url: '/logo_rond.png' }

    useEffect(() => {
        var progress = 0;
        for (let i = 0; i < progressions.length; i++) {
            progress += parseInt(progressions[i].progression);
        }
        setChapterProgress(progress / progressions.length);
    }, [progressions]);


    const fetchRessources = useCallback(async () => {
        try {
            const response_info = await getUserInfo();
            setRole(response_info.role);
            const data = await getRessourceParChap(id);
            const data2 = await getChapitreById(id);
            console.log(data.cours)
            setChapterName(data2[0].label);
            dispatch(setAllProgressions(data.cours));
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


    const handleAccordionChange = useCallback(async (index, ressource) => {
        setExpandedIndex(prevIndex => (prevIndex === index ? -1 : index));
        if (ressource.type === 'img') {
            const resourceId = ressource.id;
            const clampedPercentage = 100;
            dispatch(setProgression({ resourceId, clampedPercentage, index }))
            await addCoursProgression(resourceId, `${clampedPercentage}`);
        }
    }, [expandedIndex]);

    const handleProgressUpdate = (resourceId, newProgression) => {
        setRessources(prevRessources =>
            prevRessources.map(ressource =>
                ressource.id === resourceId ? { ...ressource, progression: newProgression } : ressource
            )
        );
    };

    const handleFlashcardDrawerClose = () => {
        console.log('close');
        setFlashcardOpen(false);
        console.log(isFlashcardOpen);
    };

    const getProgressionValue = (resourceId) => {
        const resource = progressions.find(p => p.id === resourceId);
        if (resource) {
            if (typeof resource.progression === 'number') {
                return parseFloat(resource.progression.toFixed(0));
            }
            else if (typeof resource.progression === 'string') {
                return parseFloat(resource.progression);
            }
        }
        return 0;
    };


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

                    <h1 className='study-title'>Chapitre {ChapterName}</h1>

                    <LinearProgress
                        variant="determinate"
                        value={chapterProgress}
                        sx={{
                            marginBottom: 2,
                            height: 10,
                            borderRadius: 5, 
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 5, 
                            },
                        }}
                    />

                    {ressources.length > 0 ? (
                        ressources.map((ressource, index) => (

                            <Accordion
                                key={ressource.id}
                                expanded={expandedIndex === index}
                                onChange={() => handleAccordionChange(index, ressource)}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                                    <Typography>{ressource.label}</Typography>
                                    <Typography sx={{ marginLeft: 2 }}>{getProgressionValue(ressource.id)}%</Typography>

                                </AccordionSummary>
                                <LinearProgressWithLabel value={parseInt(getProgressionValue(ressource.id))} />
                                <ResourceDisplay
                                    ressource={ressource}
                                    oldProg={ressource.progression}
                                    onProgressUpdate={(newProgression) => handleProgressUpdate(ressource.id, newProgression)}
                                    index={index}
                                />

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
                <FlashCardDrawer open={isFlashcardOpen} onClose={() => handleFlashcardDrawerClose()} chapterId={id} />
                <AddAnnotationModal parentType="Study" open={openAddAnnotation} handleClose={() => setOpenAddAnnotation(false)} resourceId={resourceIdAddAnnotation} />
                {selectedAnnotation && (<Annotation />)}
                <QuestionForum id_chap={id} role={role} />
            </div>
        </div>
    );
}

export default Study;
