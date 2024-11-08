import { Box, Button, FormControl, FormControlLabel, FormLabel, Pagination, Radio, RadioGroup, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import FlashcardsFooter from './FlashcardsFooter';
import FlashCardsModal from './FlashcardsModal';
import FlashcardsBox from './FlashcardsBox';
import DeleteIcon from '@mui/icons-material/Delete';
import { handleCloseModal, handleFlipCard } from './FlashcardsUtils';

export default function FlashcardsDisplayer({ flashCardsList, collectionName, collectionId, onUpdateFlashcards, visibility, onUpdateVisibility, deleteCollection }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [consultingMode, setConsultingMode] = useState(true);
    const [selectedFlashCard, setSelectedFlashCard] = useState(null);
    const [deleteMode, setDeleteMode] = useState(false);
    const [editingMode, setEditingMode] = useState(false);
    const [flashCards, setFlashCards] = useState(flashCardsList);
    const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 8;

    useEffect(() => {
        onUpdateFlashcards(collectionId, flashCards);
    }, [flashCards]);

    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentCards = flashCards.slice(indexOfFirstCard, indexOfLastCard);

    const handleOpenModal = (flashCard = null) => {
        setSelectedFlashCard(flashCard);
        setIsModalOpen(true);
    };

    const callCloseModal = () => {
        handleCloseModal(setIsModalOpen, setSelectedFlashCard)
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

    const handleChangeMode = () => {
        setConsultingMode(!consultingMode);
        setEditingMode(!editingMode);
        setDeleteMode(false);
    };

    const callFlipCard = (index) => {
        handleFlipCard(index, setFlashCards)
    };

    const handleDeleteCard = (index) => {
        setFlashCards((prevList) =>
            prevList.filter((_, i) => i !== index)
        );
    };

    const handleDeleteMode = () => {
        setDeleteMode(!deleteMode);
        setConsultingMode(false);
        setEditingMode(false);
    };

    const handlePageChange = (_, value) => {
        setCurrentPage(value);
    };



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
                consultingMode={consultingMode}
                deleteMode={deleteMode}
                flashCards={currentCards}
            />
            {/* Pagination placée juste avant le Footer */}
            <Pagination
                count={Math.ceil(flashCards.length / cardsPerPage)}
                page={currentPage}
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
                consultingMode={consultingMode}
                editingMode={editingMode}
                delMode={deleteMode}
            />
            {/* Modal pour ajouter ou éditer une flashcard */}
            <FlashCardsModal
                onClick={callFlipCard}
                isEditing={editingMode}
                open={isModalOpen}
                onClose={callCloseModal}
                flashCardData={selectedFlashCard}
                onSave={handleSaveFlashCard}
            />
        </Box>
    );
}
