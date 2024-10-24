import { Box, Pagination } from '@mui/material';
import StyledButton from '../composent/StyledBouton';
import React from 'react';
import Flashcards from './Flashcards';

export default function FlashcardsBox({ flashCards, consultingMode, deleteMode, handleFlipCard, handleDeleteCard, handleOpenModal, currentPage, handlePageChange, totalCards, cardsPerPage }) {
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
                {flashCards.map((flashCard, index) => (
                    <Flashcards
                        key={index}
                        data={flashCard}
                        isFlipped={flashCard.isFlipped}
                        onClick={() => {
                            if (consultingMode) {
                                handleFlipCard(index);
                            } else if (deleteMode) {
                                handleDeleteCard(index);
                            } else {
                                handleOpenModal(flashCard);
                            }
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
}
