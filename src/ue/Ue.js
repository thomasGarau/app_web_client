import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChapParUE } from '../API/UeAPI.js';
import "@fontsource/nanum-pen-script";
import './Ue.css';
import StyledButton from '../composent/StyledBouton.js';

export default function Ue() {
    const [chapters, setChapters] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const fetchChapters = async () => {
            try {
                const chaptersData = await getChapParUE(id);
                setChapters(chaptersData);
                setError(false);
            } catch (error) {
                console.error("Failed to fetch chapters:", error);
                setError(true);
            }
            setLoading(false);
        };
        fetchChapters();
    }, [id]);

    function handleChapterClick(chapter) {
        setSelectedChapter(chapter);
    }

    function handleNavigation(type) {
        if (selectedChapter) navigate(`/${type}/${selectedChapter.id_chapitre}`);
    }

    function handleCourseClick() {
        handleNavigation('etude');
    }

    function handleQuizzClick() {
        handleNavigation('quizz');
    }

    function handleFlashcardsClick() {
        handleNavigation('flash_cards');
    }

    function handleCMClick() {
        handleNavigation('carte_mentale');
    }

    return (
        <div className='ue-container'>
            <div className="chapters-container">
                <h1>Programme de l'UE n°{id}</h1>
                {error && <p>Erreur lors du chargement des chapitres.</p>}
                {loading ? (
                    <p>Chargement en cours...</p>
                ) : chapters.length > 0 ? (
                    chapters.map((chapter) => (
                        <div key={chapter.id_chapitre} className={selectedChapter == chapter.id_chapitre ? "chapter-selected" : "chapter"} onClick={() => handleChapterClick(chapter)}>
                            <h2 className='chapter-title'>{chapter.label}</h2>
                        </div>
                    ))
                ) : (
                    <p>Aucun chapitre disponible pour cette UE.</p>
                )}
            </div>
            {selectedChapter && (
                <div className="buttons-container-ue">
                    <StyledButton content={"Cours"} color={"primary"} onClick={handleCourseClick} disabled={!selectedChapter}/>
                    <StyledButton content={"Quizz"} color={"primary"} onClick={handleQuizzClick} disabled={!selectedChapter}/>
                    <StyledButton content={"Carte Mentale"} color={"primary"} onClick={handleCMClick} disabled={!selectedChapter}/>
                    <StyledButton content={"FlashCards"} color={"primary"} onClick={handleFlashcardsClick} disabled={!selectedChapter}/>
                </div>
            )}
        </div>
    );
}
