// GhostFlashcard.js
import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { handleOpenModal } from './FlashcardsUtils';
import { useDispatch } from 'react-redux';

const GhostFlashcard = ({ chapterId }) => {
    const dispatch = useDispatch();

    const handleClick = () => {
        const emptyFlashcard = {
            id_chapitre: chapterId,
            question: '',
            reponse: '',
            new: true,
        };
        handleOpenModal(emptyFlashcard, false, true, dispatch);
    };

    return (
        <Box
            sx={{
                perspective: '1000px',
                width: { xs: 'inherit', sm: '100%' },
                height: '200px',
                cursor: 'pointer',
            }}
            onClick={handleClick}
        >
            <Card
                sx={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    backgroundColor: 'transparent',
                    border: '2px dashed rgba(0, 0, 0, 0.2)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        border: '2px dashed rgba(0, 0, 0, 0.4)',
                        transform: 'scale(1.02)',
                    }
                }}
            >
                <CardContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <AddIcon 
                        sx={{ 
                            fontSize: 40,
                            color: 'rgba(0, 0, 0, 0.3)',
                        }} 
                    />
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'rgba(0, 0, 0, 0.5)',
                            fontWeight: 500
                        }}
                    >
                        Ajouter une flashcard
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default GhostFlashcard;