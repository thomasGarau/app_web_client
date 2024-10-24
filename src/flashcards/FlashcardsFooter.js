import { Box } from '@mui/material';
import StyledButton from '../composent/StyledBouton';
import React from 'react';

export default function FlashcardsFooter({ onNewClick, onEditClick, onDelClick, delMode, editingMode }) {
    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                position: 'fixed',
                bottom: 0,
                justifyContent: { xs: 'center', sm: 'space-evenly' },
                flexDirection: { xs: 'column', sm: 'row' },
                backgroundColor: '#093146',
                height: { xs: '100px', sm: '150px'},
                alignItems: 'center',
                gap: '10px',
            }}
        >
            <StyledButton content={"Nouvelle flashcards"} color={"primary"} onClick={onNewClick} />
            <StyledButton content={"Supprimer flashcards"} color={delMode ? "#cc0000" : "primary"} onClick={onDelClick} />
            <StyledButton content={editingMode ? "Editer flashcards" : "Consulter flashcards"} color={editingMode ?  "secondary" : "primary"} onClick={onEditClick} />
        </Box>
    );
}
