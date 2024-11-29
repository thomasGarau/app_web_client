import { Box, Pagination } from '@mui/material';
import React from 'react';
import Flashcards from './Flashcards';
import { handleOpenModal } from './FlashcardsUtils';
import { useDispatch } from 'react-redux';
import GhostFlashcard from './GhostFlashcard';

export default function FlashcardsBox({ flashCards, CorS }) {

    const dispatch = useDispatch();

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
                    padding: { xs: '16px 16px', sm: '16px' }
                }}
            >
                {flashCards != null ? (
                    flashCards.map((flashCard, index) => (
                        <Flashcards
                            key={index}
                            data={flashCard}
                            isFlipped={flashCard.isFlipped}
                            onClick={() => handleOpenModal(flashCard, false, false, dispatch)}
                        />

                    ))
                ) : null}
                {CorS === 'C' ?
                    <GhostFlashcard chapterId={flashCards && flashCards.length > 0 ? flashCards[0].id_chapitre :
                        null} /> :
                    null}

            </Box>
        </Box>
    );
}
