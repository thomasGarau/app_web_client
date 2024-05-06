import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getCoursParChap, recolteInteraction, addCours, editCours, deleteCours } from './StudyAPI';
import './Study.css';
import { Accordion, AccordionSummary, AccordionDetails, Typography, AccordionActions, Box, Popover } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import QuestionForum from '../composent/QuestionForum';
import { getUserInfo } from '../profile/ProfileAPI';
import StyledButton from '../composent/StyledBouton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


function Study() {
    const [cours, setCours] = useState([]);
    const [courseIds, setCourseIds] = useState([]); // État pour stocker les identifiants des cours
    const { id } = useParams(); // Si l'ID du chapitre est passé par le routeur
    const [clic, setClic] = useState(0);
    const [role, setRole] = useState('');
    const [scroll, setScroll] = useState(0);
    const [contenu, setContenu] = useState('');
    const [sujet, setSujet] = useState('');
    const [errorAnchorEl, setErrorAnchorEl] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [idStudy, setIdStudy] = useState(undefined);
    const [open, setOpen] = useState(false);
    const [currentCour, setCurrentCour] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [progression, setProgression] = useState(0);
    const clicRef = useRef(clic);
    const elapsedTimeRef = useRef(elapsedTime);
    const scrollRef = useRef(scroll);
    const progressionRef = useRef(progression);
    const startTimeRef = useRef(null);
    const [isAdding, setIsAdding] = useState(false);



    const fetchCours = async () => {
        try {
            const response_info = await getUserInfo();
            setRole(response_info.role);
            const data = await getCoursParChap(id);
            setCours(data);
            const ids = data.map(cour => cour.id_cours);
            setCourseIds(ids);
        } catch (error) {
            console.error("Erreur lors de la récupération des cours :", error);
        }
    };


    useEffect(() => {
        

        fetchCours();
        console.log(cours);
    }, [id]);

    const editCours = () => {
        console.log('edit');
    }

    const deleteCours = () => {
        console.log('delete');
    }

    const handleClosePopover = () => {
        setErrorAnchorEl(null);
        setErrorMessage('');
        setOpen(false);
    };

    const handleCurrentCour = async (event, expanded, id_cours) => {
        if (expanded) {
            setCurrentCour(id_cours);
        } else {
            try {
                // Calculer la durée de session en soustrayant la date de début de session de la date actuelle
                const dureeSession = new Date() - startTimeRef.current;
                // Utiliser les valeurs actuelles des références useRef
                await recolteInteraction(currentCour, parseInt(id), clicRef.current, dureeSession, scrollRef.current, progressionRef.current);
                setElapsedTime(0);
                setClic(0);
                setScroll(0);
                startTimeRef.current = null;
            } catch (error) {
                console.error("Erreur lors de la récolte des données:", error);
            }
            setCurrentCour(null);
        }
    }


    const incrementerClic = () => {
        console.log('clic');
        setClic(prevClic => prevClic + 1);

    };

    const incrementerScroll = (event) => {
        setScroll(prevScroll => prevScroll + 1);
        const scrollPosition = event.target.scrollTop;
        const totalHeight = event.target.scrollHeight;
        setProgression(scrollPosition / (totalHeight - event.target.clientHeight) * 100);
    };

    const handleChangeContenu = (e) => {
        const value = e.target.value;
        if (value.length > 300) {
          setErrorMessage('Limite de caractère dépassée.');
          setErrorAnchorEl(document.getElementById('contenu'));
          setIdStudy('error-popover');
          setOpen(true);
          return;
        }
        setContenu(value);
      };

      const handleCreateCours = async () => {

        if (sujet.trim() === '') {
            setErrorMessage('Ce champ est requis!');
            setErrorAnchorEl(document.getElementById('sujet'));
            setIdStudy('error-popover');
            setOpen(true);
            return
        } else if (!/^[a-zA-ZÀ-ÿ\s-]*$/.test(sujet)) {
            setErrorMessage('Caractère non autorisé. (Chiffre non autorisé)');
            setErrorAnchorEl(document.getElementById('sujet'));
            setIdStudy('error-popover');
            setOpen(true);
            return;
        }
        if (contenu.trim() === '') {
            setErrorMessage('Ce champ est requis!');
            setErrorAnchorEl(document.getElementById('contenu'));
            setIdStudy('error-popover');
            setOpen(true);
            return
        }
        try {
            console.log(sujet, contenu, id);
            await addCours(sujet, contenu, parseInt(id));
            setIsAdding(false);
            setSujet('');
            setContenu('');
            fetchCours();
            
        } catch (error) {
            console.error("Erreur lors de la création du forum :", error);
            setErrorMessage('Erreur lors de la création du forum. Veuillez réessayer.');
            setErrorAnchorEl(document.getElementById('sujet'));
            setIdStudy('error-popover');
            setOpen(true);
        }
    };


    useEffect(() => {
        // Initialiser la référence useRef avec la date de début de session lorsque le composant est monté
        startTimeRef.current = new Date();

        const sendData = async () => {
            setElapsedTime(new Date());
            try {
                // Calculer la durée de session en soustrayant la date de début de session de la date actuelle
                const dureeSession = new Date() - startTimeRef.current;
                // Utiliser les valeurs actuelles des références useRef
                await recolteInteraction(currentCour, parseInt(id), clicRef.current, dureeSession, scrollRef.current, progressionRef.current);
                setElapsedTime(0);
                setClic(0);
                setScroll(0);
            } catch (error) {
                console.error("Erreur lors de la récolte des données:", error);
            }
        };
        const interval = setInterval(sendData, 180000);
        if (currentCour === null) {
            clearInterval(interval);
        }

        // Retourner une fonction de nettoyage pour arrêter l'envoi de données lorsque le composant est démonté
        return () => clearInterval(interval);
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
                    {cours.length > 0 ? (
                        cours.map(cour => (
                            <Accordion
                                onClick={incrementerClic}
                                onChange={(event, expanded) => handleCurrentCour(event, expanded, cour.id_cours)}
                                key={cour.id_cours}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>{cour.label}</Typography>
                                </AccordionSummary>
                                <AccordionDetails
                                    onScroll={incrementerScroll}
                                    sx={{ overflowY: 'auto', maxHeight: '400px' }}>
                                    <Typography className='paragraphe'>
                                        {cour.contenu}
                                    </Typography>
                                </AccordionDetails>
                                <AccordionActions>
                                    <div className='icon-study' onClick={editCours}> <EditIcon /></div>
                                      <div className='icon-study' onClick={deleteCours}><DeleteIcon /></div> 
                                        
                                </AccordionActions>
                            </Accordion>
                        ))
                    ) : (
                        <p>Aucun cours disponible pour ce chapitre.</p>
                    )}
                </div>
                {role === 'etudiant' && (
                <QuestionForum id_chap={id} />
                )}
                {role === 'enseignant' && !isAdding && (
                    <StyledButton
                    content={"Ajouter un cours"}
                    width={200}
                    color={"primary"}
                    onClick={() => setIsAdding(true)}
                    />
                    )}
                {role === 'enseignant' && isAdding && (
                    <div className='ajouter-cours-container'>
                        <Box display="flex" alignItems="center" width="20%" padding="10px">
                            <Typography
                                sx={{
                                    mr: 1,
                                    width: "50%",
                                    color: 'white',
                                    fontSize: {
                                        xs: "1em",
                                        sm: "1.2em",
                                        md: "1.5em"
                                    }
                                }}
                                className='create-forum-typography'>
                                Nom du cours :
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
                        <Box display="flex" alignItems="center" width="40%" padding="10px">
                            <Typography sx={{
                                mr: 1,
                                width: "50%",
                                color: 'white',
                                fontSize: {
                                    xs: "1em",
                                    sm: "1.2em",
                                    md: "1.5em"
                                }
                            }}
                                className='create-forum-typography'>
                                Contenu du cours :
                            </Typography>
                            <textarea
                                aria-describedby={id}
                                id='contenu'
                                className='form-textarea'
                                value={contenu}
                                onChange={handleChangeContenu}
                                sx={{
                                    width: {
                                        xs: "80%",  // Plus large sur les petits écrans pour une meilleure accessibilité
                                        sm: "80%",
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
                        <StyledButton
                            content={"Ajouter"}
                            width={200}
                            color={"primary"}
                            onClick={handleCreateCours}
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

export default Study;
