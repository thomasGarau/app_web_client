import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChapParUE, ueInfo } from './UeAPI.js';
import './Ue.css'; // Assurez-vous que le chemin est correct pour vos styles

function UeProf() {
    const [chapters, setChapters] = useState([]);
    const { id } = useParams();
    const [label, setLabel] = useState(''); // Ajout d'un état pour stocker le label de l'UE [1/2
    const navigate = useNavigate(); 

    useEffect(() => {
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
        fetchChapters();
    }, [id]);
    
    const handleQuizClick = (chapterId) => {
        navigate(`/gestion_quizz/prof/${chapterId}`);
    };

    const handleCourseClick = (chapterId) => {
        navigate(`/etude/${chapterId}`);
    };

    return (
        <div className='background-ue-prof'>
            <div className='container2_style'>
                <h1>UE {label}</h1>
                <div className="container-home-prof-ue">
                    <div className='container-chap-chap-ue-prof'>
                        {chapters.length > 0 ? (
                            chapters.map((chapter) => (
                                <div className='container-chap-ue-prof' key={chapter.id_chapitre}>
                                    <h4>{chapter.label}</h4>
                                    <p className="link-style" onClick={() => handleQuizClick(chapter.id_chapitre)}>Quizz du chap {chapter.label}</p>
                                    <p className="link-style" onClick={() => handleCourseClick(chapter.id_chapitre)}>Cours du chap {chapter.label}</p>
                                </div>
                            ))
                        ) : (
                            <p>Aucun chapitre disponible pour cette UE.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UeProf;
