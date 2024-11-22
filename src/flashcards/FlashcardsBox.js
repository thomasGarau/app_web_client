import { Box, Pagination } from '@mui/material';
import StyledButton from '../composent/StyledBouton';
import React from 'react';
import Flashcards from './Flashcards';

export default function FlashcardsBox({ flashCards, currentMode, setSelectedFlashcard, handleDeleteCard, handleOpenModal, id_chap=null, onRemoveFromCollection = null }) {
    
    return (
        <Box>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(4, 1fr)'
                    },
                    gap: { xs: '20px 0px', sm: '20px' },
                    padding: { xs: '16px 0px', sm: '16px' }
                }}
            >
                {flashCards != null ? (
                    flashCards.map((flashCard, index) => (
                        <Flashcards
                            key={index}
                            data={flashCard}
                            isFlipped={flashCard.isFlipped}
                            id_chap={id_chap}
                            onRemoveFromCollection={onRemoveFromCollection}
                            onClick={
                                currentMode == 'deleting' ?
                                    () => handleDeleteCard(flashCard.id_flashcard) :
                                    () => handleOpenModal(flashCard, setSelectedFlashcard)}
                        />
                    ))
                ) : null}

            </Box>
        </Box>
    );
}
