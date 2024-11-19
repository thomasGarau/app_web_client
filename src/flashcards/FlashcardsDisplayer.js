import { Box, Button, FormControlLabel, Pagination, Radio, RadioGroup, Typography } from '@mui/material';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import FlashcardsFooter from './FlashcardsFooter';
import FlashCardsModal from './FlashcardsModal';
import FlashcardsBox from './FlashcardsBox';
import DeleteIcon from '@mui/icons-material/Delete';
import { handleCloseModal, handleFlipCard } from './FlashcardsUtils';

export default function FlashcardsDisplayer({ flashCardsList, collectionName, collectionId, onUpdateFlashcards, visibility, onUpdateVisibility, deleteCollection }) {

    const MODES = {
        CONSULTING: 'consulting',
        EDITING: 'editing',
        DELETING: 'deleting',
        CREATING: 'creating'
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFlashCard, setSelectedFlashCard] = useState(null);
    const [flashCards, setFlashCards] = useState(flashCardsList);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentMode, setCurrentMode] = useState(MODES.CONSULTING);
    const [cardsPerPage, setCardsPerPage] = useState(() => {
        const screenWidth = window.innerWidth;
        if (screenWidth < 600) return 4;
        if (screenWidth < 1024) return 6;
        return 8;
    });

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth < 600) setCardsPerPage(4);
            else if (screenWidth < 1024) setCardsPerPage(6);
            else setCardsPerPage(8);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const paginationData = useMemo(() => {
        const totalCards = flashCardsList.length;
        const totalPages = Math.ceil(totalCards / cardsPerPage);

        const adjustedCurrentPage = Math.min(currentPage, totalPages);

        const indexOfLastCard = adjustedCurrentPage * cardsPerPage;
        const indexOfFirstCard = indexOfLastCard - cardsPerPage;

        const currentCards = flashCardsList.slice(indexOfFirstCard, indexOfLastCard);

        return {
            totalPages,
            currentCards,
            adjustedCurrentPage
        };
    }, [flashCardsList, currentPage, cardsPerPage]);

    useEffect(() => {
        onUpdateFlashcards(collectionId, flashCards);
    }, [flashCards]);

    const handleOpenModal = (flashCard = null) => {
        if (flashCard) {
            setSelectedFlashCard(flashCard);

        } else {
            setCurrentMode(MODES.CREATING);
        }
        setIsModalOpen(true);

    };


    const callCloseModal = () => {
        if (currentMode === MODES.CREATING) {
            setCurrentMode(MODES.CONSULTING);
        }
        handleCloseModal(setIsModalOpen, setSelectedFlashCard);
    };

    const handleSaveFlashCard = (newFlashCard) => {
        if (selectedFlashCard) {
            setFlashCards((prevList) =>
                prevList.map((card) =>
                    card === selectedFlashCard ? newFlashCard : card
                )
            );
        } else {
            setFlashCards((prevList) => [...prevList, newFlashCard]);
        }
    };

    const callFlipCard = (index) => {
        handleFlipCard(index, setFlashCards)
    };

    const handleDeleteCard = useCallback((index) => {
        setFlashCards(prevList => prevList.filter((_, i) => i !== index));
    }, []);


    const handleDeleteMode = useCallback(() => {
        setCurrentMode(mode =>
            mode === MODES.DELETING ? MODES.CONSULTING : MODES.DELETING
        );
    }, []);

    const handlePageChange = useCallback((_, value) => {
        setCurrentPage(value);
    }, []);

    const handleChangeMode = useCallback(() => {
        setCurrentMode(mode => {
            const newMode = mode === MODES.CONSULTING ? MODES.EDITING : MODES.CONSULTING;
            console.log("Changing mode from", mode, "to", newMode);
            return newMode;
        });
    }, []);


    return (
        <Box sx={{ flexGrow: 1 }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <Typography variant='h4' sx={{ marginLeft: '16px' }}>Flashcards de la collection {collectionName}</Typography>
                <Box sx={{ display: 'flex', flex: 1 }}>
                    <Button onClick={() => deleteCollection(collectionId)} sx={{ position: 'relative', left: 0, margin: '0px 20px' }}>
                        <DeleteIcon style={{ fill: "#000" }} />
                    </Button>
                </Box>
                <RadioGroup
                    row
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={visibility}
                    onChange={(event) => onUpdateVisibility(collectionId, event.target.value)} // Appelle la fonction ici
                >
                    <FormControlLabel value="private" control={<Radio />} label="Privé" />
                    <FormControlLabel value="public" control={<Radio />} label="Publique" />
                </RadioGroup>
            </Box>
            <FlashcardsBox
                handleDeleteCard={handleDeleteCard}
                handleFlipCard={callFlipCard}
                handleOpenModal={handleOpenModal}
                delMode={currentMode === MODES.DELETING}
                editingMode={currentMode === MODES.EDITING}
                flashCards={paginationData.currentCards}
            />
            {/* Pagination placée juste avant le Footer */}
            <Pagination
                count={paginationData.totalPages}
                page={paginationData.adjustedCurrentPage}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
                sx={{
                    marginTop: '16px', display: 'flex',
                    justifyContent: 'center',
                    position: 'fixed',
                    right: '50%',
                    bottom: '170px',
                    transform: 'translateX(50%)',
                    margin: '30px 0px'
                }}
            />
            <FlashcardsFooter
                onNewClick={() => handleOpenModal()}
                onEditClick={handleChangeMode}
                onDelClick={handleDeleteMode}
                currentMode={currentMode}
            />
            {/* Modal pour ajouter ou éditer une flashcard */}
            <FlashCardsModal
                onClick={callFlipCard}
                isEditing={currentMode === MODES.CREATING || currentMode === MODES.EDITING}
                open={isModalOpen}
                onClose={callCloseModal}
                flashCardData={selectedFlashCard}
                onSave={handleSaveFlashCard}
            />
        </Box>
    );
}
