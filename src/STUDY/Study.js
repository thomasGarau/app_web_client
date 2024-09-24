import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getCoursParChap, addCours, editCours, deleteCours } from '../API/CoursAPI';
import './Study.css';
import { Accordion, AccordionSummary, AccordionDetails, Typography, AccordionActions, Box, Popover, TextField, Modal } from '@mui/material';
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


const style = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: '70%', md: '50%' },
    bgcolor: 'background.paper',
    border: '2px solid #133D56',
    boxShadow: 24,
    borderRadius: 2,
    Typography: 4,
    height: '90vh',
};

function Study() {
    const [ressources, setRessources] = useState([]);
    const [courseIds, setCourseIds] = useState([]);
    const { id } = useParams();
    const [clic, setClic] = useState(0);
    const [role, setRole] = useState('');

    const [contenu, setContenu] = useState('');
    const [sujet, setSujet] = useState('');
    const [open, setOpen] = useState(false);
    const [currentCour, setCurrentCour] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { errorMessage, errorAnchorEl, idEl, openAnchor, showErrorPopover, handleClosePopover } = useErrorPopover();

    const scroll = useSelector((state) => state.pdfViewer.scroll);
    const progression = useSelector((state) => state.pdfViewer.progression);
    const dispatch = useDispatch();

    const progressionRef = useRef(progression);
    const scrollRef = useRef(scroll);
    const clicRef = useRef(clic);
    const elapsedTimeRef = useRef(elapsedTime);
    const startTimeRef = useRef(null);

    const ressourcePdf = { type: 'pdf', url: '/demo.pdf' }
    const ressourceMp4 = { type: 'video', url: '/test.mp4' }
    const ressourceYt = { type: 'video', url: 'https://www.youtube.com/watch?v=5YIyTF7izJk' }
    const ressourceImg = { type: 'img', url: '/logo_rond.png' }


    const fetchCours = async () => {
        try {
            const response_info = await getUserInfo();
            setRole(response_info.role);
            const data = await getCoursParChap(id);
            setRessources(data);
            const ids = data.map(cour => cour.id_cours);
            setCourseIds(ids);
        } catch (error) {
            console.error("Erreur lors de la récupération des ressources :", error);
        }
    };


    useEffect(() => {
        fetchCours();
    }, [id]);

    const isEditingCour = (cour) => {
        setEditingCourseId(cour.id_cours);
        setContenu(cour.contenu);
        setSujet(cour.label);
        setIsEditing(true);
    };

    const deleteCour = (id_cours) => {
        try {
            deleteCours(id_cours);
            fetchCours();
        } catch (error) {
            console.error("Erreur lors de la suppression du ressources :", error);
        }
    }

    const handleCloseAdd = () => {
        setIsAdding(false);
    };

    const handleCloseEdit = () => {
        setIsEditing(false);
    };

    const incrementerClic = () => {
        setClic(prevClic => prevClic + 1);

    };

    const handleChangeContenu = (e) => {
        const value = e.target.value;
        setContenu(value);
    };

    const handleChangeSujet = (e) => {
        const value = e.target.value;
        if (value.length > 100) {
            showErrorPopover('Limite de caractère dépassée.', 'sujet');
            return;
        }
        setSujet(value);
    };

    const validateCourseInputs = (label, content) => {
        if (label.trim() === '') {
            showErrorPopover('Le nom de la ressource est requis!', 'sujet');
            return false;
        } else if (!/^[a-zA-Z0-9 ,.!?'"ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñÇç;:()\[\]{}\/*\-+=%$#@\^`~&]*$/.test(label)) {
            showErrorPopover('Caractère non autorisé. (Chiffre non autorisé)', 'sujet');
            return false;
        }

        if (content.trim() === '') {
            showErrorPopover('Le contenu de la ressource est requis!', 'contenu');
            return false;
        } else if (!/^[a-zA-Z0-9 ,.!?'"ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñÇç;:()\[\]{}\/*\-+=%$#@\^`~&]*$/.test(content)) {
            showErrorPopover('Caractère non autorisé. (Chiffre non autorisé)', 'contenu');
            return false;
        }

        return true;
    };


    const handleCreateCours = async () => {
        if (validateCourseInputs(sujet, contenu)) {
            try {
                await addCours(sujet, contenu, parseInt(id));
                setSujet('');
                setContenu('');
                fetchCours();
                handleCloseAdd();
            } catch (error) {
                console.error("Erreur lors de la création de la ressource :", error);
                showErrorPopover('Erreur lors de la création de la ressource. Veuillez réessayer.', 'sujet-add');

            }
        }

    };

    const handleEditCours = async () => {
        if (validateCourseInputs(sujet, contenu)) {
            try {
                console.log(sujet, contenu, id)
                await editCours(editingCourseId, sujet, contenu);
                setSujet('');
                setContenu('');
                fetchCours();
                handleCloseEdit();
            } catch (error) {
                console.error("Erreur lors de la modification de la ressource :", error);
                showErrorPopover('Erreur lors de la modification de la ressource. Veuillez réessayer.', 'sujet-edit');
            }
        }

    };


    useEffect(() => {
        startTimeRef.current = new Date();

        const sendData = async () => {
            const { token, role } = await getTokenAndRole();
            const tokenInfo = decodeJWT(token);
            if (tokenInfo.consentement === 1) {
                setElapsedTime(new Date());
                try {
                    const dureeSession = new Date() - startTimeRef.current;
                    await recolteInteraction(currentCour, parseInt(id), clicRef.current, dureeSession, scrollRef.current, progressionRef.current);
                    setElapsedTime(0);
                    setClic(0);
                    dispatch(setScroll(0));
                } catch (error) {
                    console.error("Erreur lors de la récolte des données:", error);
                }
            };
            const interval = setInterval(sendData, 180000);
            if (currentCour === null) {
                clearInterval(interval);
            }

            return () => clearInterval(interval);
        }
    }, [currentCour, id]);


    useEffect(() => {
        clicRef.current = clic;
        elapsedTimeRef.current = elapsedTime;
        scrollRef.current = scroll;
        progressionRef.current = progression;
    }, [clic, elapsedTime, scroll, progression]);

    return (
        <div className='background-study'>
            <div className='sub_container_text_question'>
                <div className='text-part'>
                    <h1 className='study-title'>Cours du chapitre</h1>
                    {ressources.length > 0 ? (
                        ressources.map(ressource => (
                            <Accordion onClick={incrementerClic} key={ressource.id_cours} onChange={(event, expanded) => {
                            }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">

                                    <Typography>{ressource.label}</Typography>

                                </AccordionSummary>
                                {/*<AccordionDetails
                                    onScroll={incrementerScroll}
                                    sx={{ overflowY: 'auto', maxHeight: '400px' }}>

                                    <Typography>{cour.contenu}</Typography>

                                </AccordionDetails>*/}
                                <ResourceDisplay ressource={ressourceImg} />

                                <AccordionActions>

                                    <div>
                                        {role === 'enseignant' && (
                                            <>
                                                <div className='icon-study' onClick={() => isEditingCour(ressource)}>
                                                    <EditIcon />
                                                </div><div className='icon-study' onClick={() => deleteCour(ressource.id_cours)}>
                                                    <DeleteIcon />
                                                </div>
                                            </>
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
                    <><Modal
                        open={isAdding}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <TextField
                                id='sujet-add'
                                placeholder='Sujet de la ressource'
                                variant='standard'
                                sx={{

                                    width: "100%",

                                }}
                                inputProps={{
                                    sx: {
                                        padding: '10px',
                                        fontSize: {
                                            xs: "1em",
                                            sm: "1.3em",
                                            md: "1.7em"
                                        }
                                    }
                                }}
                                value={sujet}
                                onChange={handleChangeSujet}>

                            </TextField>
                            <TextField
                                placeholder='Contenu de la ressource'
                                variant='filled'
                                aria-describedby={id}
                                multiline
                                id='contenu'
                                value={contenu}
                                onChange={handleChangeContenu}
                                rows={27}
                                sx={{
                                    overflowY: 'auto',
                                    width: '100%',
                                    fontSize: {
                                        xs: "0.8em", // Plus petite taille de police sur les petits écrans
                                        sm: "1.2em",
                                        md: "1.5em" // Taille normale sur les écrans plus larges
                                    },

                                }} />
                            <Box>
                                <StyledButton
                                    content={"Ajouter"}
                                    width={200}
                                    color={"primary"}
                                    onClick={handleCreateCours} />
                            </Box>

                        </Box>
                    </Modal>
                        <PopoverError
                            id={idEl}
                            open={openAnchor}
                            anchorEl={errorAnchorEl}
                            onClose={handleClosePopover}
                            errorMessage={errorMessage}
                        />
                    </>

                )}
                <QuestionForum id_chap={id} role={role} />
                <Modal
                    open={isEditing}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <TextField
                            id='sujet-edit'
                            placeholder='Sujet de la ressource'
                            variant='standard'
                            sx={{

                                width: "100%",

                            }}
                            inputProps={{
                                sx: {
                                    padding: '10px',
                                    fontSize: {
                                        xs: "1em",
                                        sm: "1.3em",
                                        md: "1.7em"
                                    }
                                }
                            }}
                            value={sujet}
                            onChange={handleChangeSujet}>

                        </TextField>
                        <TextField
                            placeholder='Contenu de la ressource'
                            variant='filled'
                            aria-describedby={id}
                            multiline
                            id='contenu'
                            value={contenu}
                            onChange={handleChangeContenu}
                            rows={27}
                            sx={{
                                overflowY: 'auto',
                                width: '100%',
                                fontSize: {
                                    xs: "0.8em", // Plus petite taille de police sur les petits écrans
                                    sm: "1.2em",
                                    md: "1.5em" // Taille normale sur les écrans plus larges
                                },

                            }} />
                        <Box>
                            <StyledButton
                                content={"Valider"}
                                width={200}
                                color={"primary"}
                                onClick={handleEditCours} />
                        </Box>

                    </Box>
                </Modal>
            </div>
        </div>
    );
}

export default Study;
