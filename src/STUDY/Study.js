import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../composent/Header';
import { getCoursParChap } from './StudyAPI';
import './Study.css';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import QuestionForum from '../composent/QuestionForum';

function Study() {
    const [cours, setCours] = useState([]);
    const [courseIds, setCourseIds] = useState([]); // État pour stocker les identifiants des cours
    const { id } = useParams(); // Si l'ID du chapitre est passé par le routeur

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

    return (
        <div className='background-study'>
            <Header />
            <div className='sub_container_text_question'>
                <div className='text-part'>
                    <h1 className='study-title'>Cours du chapitre</h1>
                    {cours.length > 0 ? (
                        cours.map(cour => (
                            <Accordion key={cour.id_cours}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>{cour.label}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
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
                <QuestionForum id_chap={id}  />
            </div>
        </div>
    );
}

export default Study;
