import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChapParUE, ueInfo, addChapitre, updateChapitre, deleteChapitre } from '../API/UeAPI.js';
import ChapitreList from './composant/ChapitreList.js';
import AddChapitreForm from './composant/AddChapitreForm.js';
import StyledButton from '../composent/StyledBouton';
import { contenuRegex } from '../services/Regex.js';
import './Ue.css';

function UeProf() {
    const [chapters, setChapters] = useState([]);
    const { id } = useParams();
    const [label, setLabel] = useState(''); 
    const navigate = useNavigate(); 
    const [isAdding, setIsAdding] = useState(false); 
    const [editChapterId, setEditChapterId] = useState(null);
    const [isEditing, setIsEditing] = useState(false); 
    const [nom, setNom] = useState('');
    const [open, setOpen] = useState(false);
    const [errorAnchorEl, setErrorAnchorEl] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');


    const validateChapInputs = (label) => {
        if (!contenuRegex.test(label)) {
           setErrorMessage('Caractère non autorisé.');
           setErrorAnchorEl(document.getElementById('nom'));
           setOpen(true);
           return false;
       }
   
       return true;
   };

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

    useEffect(() => {
        
        fetchChapters();
    }, [id]);

    const handleQuizClick = (chapterId) => navigate(`/gestion_quizz/prof/${chapterId}`);
    const handleCourseClick = (chapterId) => navigate(`/etude/${chapterId}`);
    const handleFlashcardsClick = (chapterId) => navigate(`/flash_cards/${chapterId}`);

    const editChap = (chapterId) => {
        setIsEditing(true);
        setEditChapterId(chapterId);
        const chap = chapters.find(chap => chap.id_chapitre === chapterId);
        setNom(chap.label);
    };

    const handleEditChapter = async (chapterId) => {
        if(validateChapInputs(nom)) {
            try {
                await updateChapitre(chapterId, nom); // Assumer que `updateChapitre` est une API pour mettre à jour un chapitre
                setIsEditing(false);
                setEditChapterId('');
                setNom('');
                fetchChapters();
            } catch (error) {
                console.error("Erreur lors de la mise à jour du chapitre :", error);
                setErrorMessage('Erreur lors de la mise à jour du chapitre. Veuillez réessayer.');
                setErrorAnchorEl(document.getElementById('nom'));
                setOpen(true);
            }
        }
    };

    const deleteChap = (chapterId) => {
        try{
            deleteChapitre(chapterId);
            fetchChapters();
        }
        catch (error) {
            console.error("Erreur lors de la suppression du chapitre :", error);
        }
    };

    const handleAddChapitre = () => setIsAdding(true);
    const handleCreateChap = async () => {
        if(validateChapInputs(nom)) {
            try {
                await addChapitre(nom, id);
                setIsAdding(false);
                setNom('');
                fetchChapters();
            }
            catch (error) {
                console.error("Erreur lors de la création du chapitre :", error);
                setErrorMessage('Erreur lors de la création du chapitre. Veuillez réessayer.');
                setErrorAnchorEl(document.getElementById('nom'));
                setOpen(true);
            }
        }
    };

    const handleClosePopover = () => {
        setErrorAnchorEl(null);
        setErrorMessage('');
        setOpen(false);
    };

    return (
        <div className='background-ue-prof'>
            <div className='container-ue-prof'>
                <h1>UE {label}</h1>
                <ChapitreList
                    chapters={chapters}
                    editChapterId={editChapterId}
                    isEditing={isEditing}
                    nom={nom}
                    setNom={setNom}
                    onEdit={editChap}
                    onDelete={deleteChap}
                    onSave={handleEditChapter}
                    onQuizClick={handleQuizClick}
                    onCourseClick={handleCourseClick}
                    onFlashcardsClick={handleFlashcardsClick}
                    errorAnchorEl={errorAnchorEl}
                    errorMessage={errorMessage}
                    open={open}
                    handleClosePopover={handleClosePopover}
                />
                {!isAdding && (
                    <StyledButton height={50} color={"primary"} onClick={handleAddChapitre} content={"Ajouter un chapitre"} />
                )}
                {isAdding && (
                    <AddChapitreForm
                        nom={nom}
                        setNom={setNom}
                        handleCreateChap={handleCreateChap}
                        errorAnchorEl={errorAnchorEl}
                        open={open}
                        handleClosePopover={handleClosePopover}
                        errorMessage={errorMessage}
                    />
                )}
            </div>
        </div>
    );
}

export default UeProf;
