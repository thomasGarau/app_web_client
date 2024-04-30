import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChapParUE } from './UeAPI.js';
import "@fontsource/nanum-pen-script";
import Header from '../composent/Header.js';
import './Ue.css';
import StyledButton from '../composent/StyledBouton.js';

export default function Ue() {
    const [chapters, setChapters] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const chaptersData = await getChapParUE(id);
                setChapters(chaptersData);
            } catch (error) {
                console.error("Failed to fetch chapters:", error);
            }
        };
        fetchChapters();
    }, [id]);

    function handleChapterClick(chapterId) {
        setSelectedChapter(chapterId);
    }

    function handleCourseClick() {
        navigate(`/etude/${selectedChapter}`);
    }

    function handleQuizzClick() {
        navigate(`/quizz/${selectedChapter}`);
    }

    return (
        <div className='ue-container'>
            <div className="chapters-container">
                <h1>Programme de l'UE n°{id}</h1>
                {chapters.length > 0 ? (
                    chapters.map((chapter) => (
                        <div key={chapter.id_chapitre} className={selectedChapter == chapter.id_chapitre ? "chapter-selected" : "chapter"} onClick={() => handleChapterClick(chapter.id_chapitre)}>
                            <h2 className='chapter-title'>{chapter.label}</h2>
                        </div>
                    ))
                ) : (
                    <p>Aucun chapitre disponible pour cette UE.</p>
                )}
            </div>
            {selectedChapter && (
                <div className="buttons-container-ue">
                    <StyledButton content={"Cours"} color={"primary"} onClick={handleCourseClick}/>
                    <StyledButton content={"Quizz"} color={"primary"} onClick={handleQuizzClick}/>
                    <StyledButton content={"Create"} color={"primary"} onClick={() => console.log('Create')}/>
                </div>
            )}
        </div>
    );
}
