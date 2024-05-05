import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getCoursParChap, recolteInteraction } from './StudyAPI';
import './Study.css';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import QuestionForum from '../composent/QuestionForum';

function Study() {
    const [cours, setCours] = useState([]);
    const [courseIds, setCourseIds] = useState([]); // État pour stocker les identifiants des cours
    const { id } = useParams(); // Si l'ID du chapitre est passé par le routeur
    const [clic, setClic] = useState(0);
    const [scroll, setScroll] = useState(0);
    const [currentCour, setCurrentCour] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [progression, setProgression] = useState(0);
    const clicRef = useRef(clic);
    const elapsedTimeRef = useRef(elapsedTime);
    const scrollRef = useRef(scroll);
    const progressionRef = useRef(progression);
    const startTimeRef = useRef(null);

    useEffect(() => {
        const fetchCours = async () => {
            try {
                const data = await getCoursParChap(id);
                setCours(data);
                // Extraction des id des cours
                const ids = data.map(cour => cour.id_cours);
                setCourseIds(ids);
            } catch (error) {
                console.error("Erreur lors de la récupération des cours :", error);
            }
        };

        fetchCours();
    }, [id]);

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
                startTimeRef.current = null;
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
                            </Accordion>
                        ))
                    ) : (
                        <p>Aucun cours disponible pour ce chapitre.</p>
                    )}
                </div>
                {/* Passage de la liste des id de cours à QuestionForum */}
                <QuestionForum id_chap={id} />
            </div>
        </div>
    );
}

export default Study;
