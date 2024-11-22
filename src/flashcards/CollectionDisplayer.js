import React, { useCallback, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { createFlashcard, deleteFlashcard, getAllFlashcards, getUserFlashcards, updateFlashcard } from '../API/FlashcardsAPI';
import FlashcardsDisplayer from './FlashcardsDisplayer';
import FlashCardsModal from './FlashcardsModal';
import FlashcardsFooter from './FlashcardsFooter';
import { getTokenAndRole } from '../services/Cookie';
import { jwtDecode } from 'jwt-decode';
import StyledButton from '../composent/StyledBouton';

const CollectionDisplayer = () => {
    const MODES = {
        CONSULTING: 'consulting',
        EDITING: 'editing',
        DELETING: 'deleting',
        CREATING: 'creating'
    };
    const { id_chap } = useParams();
    const [user, setUser] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFlashCard, setSelectedFlashCard] = useState(null);
    const [currentMode, setCurrentMode] = useState(MODES.CONSULTING);
    const navigate = useNavigate();


    useEffect(() => {
        fetchMyCollection();
        fetchData();
    }, []);

    const fetchData = async () => {
        const { token, role } = await getTokenAndRole();
        const decodedToken = jwtDecode(token);
        setUser(decodedToken.id_etudiant);
    }

    const fetchMyCollection = async () => {
        try {
            const response = await getUserFlashcards(id_chap);

            const processedFlashcards = response.map(flashcard => {
                if (flashcard.visibilite === 'orphelin') {
                    return { ...flashcard, orphan: true };
                }
                return flashcard;
            });

            setFlashcards(processedFlashcards);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        fetchMyCollection();
    }, [id_chap]);


    const newFlashcard = async (question, reponse, visibilite) => {
        try {
            await createFlashcard(id_chap, question, reponse, visibilite);
            await fetchMyCollection();
        } catch (error) {
            console.error(error);
        }
    };

    const removeFlashcard = async (id_flashcard) => {
        try {
            await deleteFlashcard(id_flashcard);
            await fetchMyCollection();
        } catch (error) {
            console.error(error);
        }
    };

    const toSearch = () => {
        navigate(`/search_flashcards/${id_chap}`);
    };


    const handleUpdateFlashcard = async (id_flashcard, question, reponse) => {
        try {
            await updateFlashcard(id_flashcard, question, reponse);
            await fetchMyCollection();
        } catch (error) {
            console.error(error);
        }
    };

    const handleNewFlashcard = () => {
        setCurrentMode(MODES.CREATING);
        setIsModalOpen(true);
    };

    const handleChangeMode = useCallback(() => {
        setCurrentMode((mode) => {
            const newMode = mode === MODES.CONSULTING ? MODES.EDITING : MODES.CONSULTING;
            return newMode;
        });
    }, []);



    const handleDeleteMode = useCallback(() => {
        setCurrentMode(mode =>
            mode === MODES.DELETING ? MODES.CONSULTING : MODES.DELETING
        );
    }, []);

    const handleOpenModal = (flashCard = null) => {
        if (flashCard) {
            setSelectedFlashCard(flashCard);

        } else {
            setCurrentMode(MODES.CREATING);
        }
        setIsModalOpen(true);

    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedFlashCard(null);
        setCurrentMode(MODES.CONSULTING);
    };

    return (
        <Box sx={{ position: 'relative', top: 150, width: '100%' }}>
            <Box sx={{
                display: 'flex', justifyContent: 'space-around', marginBottom: 2, alignItems: 'center'
            }}>
                <Typography variant="h4" gutterBottom>
                    Ma collection de flashcards
                </Typography>
                <StyledButton content={'Chercher des flashcards'} width={350} color={'primary'} onClick={toSearch} />
            </Box>
            {flashcards && (
                <FlashcardsDisplayer
                    flashCardsList={ flashcards}
                    currentMode={currentMode}
                    handleOpenModal={handleOpenModal}
                    handleDeleteCard={removeFlashcard}
                    onRemoveFromCollection={fetchMyCollection}
                />
            )}

            {/* Footer avec les options */}
            <FlashcardsFooter
                onNewClick={handleNewFlashcard}
                onEditClick={handleChangeMode}
                onDelClick={handleDeleteMode}
                currentMode={currentMode}
                flashCardsList={flashcards}
            />

            {/* Modal pour ajouter ou éditer une flashcard */}
            <FlashCardsModal
                open={isModalOpen}
                onClose={handleCloseModal}
                onSave={selectedFlashCard == null ? newFlashcard : handleUpdateFlashcard}
                flashCardData={selectedFlashCard}
                isEditing={
                    selectedFlashCard != null &&
                    selectedFlashCard.id_utilisateur == user
                    && currentMode === MODES.EDITING
                    || currentMode === MODES.CREATING
                }
            />
        </Box>
    );
};

export default CollectionDisplayer;
