import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "@fontsource/nanum-pen-script";
import Header from '../composent/Header.js';
import './Ue.css';

function Ue() {
    const [chapters, setChapters] = useState([
        { id: 1, title: 'Introduction à React', description: 'Découvrez les bases de React.' },
        { id: 2, title: 'Les composants', description: 'Apprenez à créer et utiliser des composants.' },
        { id: 3, title: 'Gestion de l\'état', description: 'Techniques pour gérer l\'état dans vos applications.' }
    ]);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

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
        <div>
            <Header />
            <div className="chapters-container">
                <h1>Programme de l'UE n°{id}</h1>
                {chapters.map((chapter) => (
                    <div key={chapter.id} className="chapter" onClick={() => handleChapterClick(chapter.id)}>
                        <h2>{chapter.title}</h2>
                        <p>{chapter.description}</p>
                    </div>
                ))}
            </div>
            {selectedChapter && (
                <div className="buttons-container">
                    <button onClick={handleCourseClick}>Cours</button>
                    <button onClick={handleQuizzClick}>Quizz</button>
                    <button onClick={() => console.log('Create')}>Create</button>
                </div>
            )}
        </div>
    );
}

export default Ue;
