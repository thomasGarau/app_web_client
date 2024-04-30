//dependances
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../composent/Header';
import { getCoursParChap } from './StudyAPI';
import './Study.css';
import { Button } from '@mui/material';
import QuestionForum from '../composent/QuestionForum';

function Study() {

    const [cours, setCours] = useState('');
    const { id } = useParams(); // Si l'ID du chapitre est passé par le routeur

    useEffect(() => {
        const fetchCours = async () => {
            try {
                const data = await getCoursParChap(id);
                setCours(data); // Assurez-vous que la réponse est le format attendu
                console.log("data : ",data);
            } catch (error) {
                console.error("Erreur lors de la récupération des cours :", error);
            }
        };

        fetchCours();
    }, [id]);


    return (
        <div className='background-study'>
            <div className='sub_container_text_question'>
            <div className='text-part'>
            <h1 className='study-title'>Cours du chapitre</h1>
            {cours.length > 0 ? (
                cours.map(cour => (
                    <div key={cour.id_cours}>
                        <h2>{cour.label}</h2>
                        <p className='paragraphe'>{cour.contenu}</p>
                    </div>
                 ))
                ) : (
                    <p>Aucun cours disponible pour ce chapitre.</p>
                )}
            </div>
           {/* <QuestionForum courseId={id} /> */}
            </div>
        </div>
    )
} export default Study;
