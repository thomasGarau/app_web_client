import { Box } from '@mui/material';
import StyledButton from '../composent/StyledBouton';
import React from 'react';

export default function FlashcardsFooter({ onNewClick, onEditClick, onDelClick, currentMode }) {
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
                height: { xs: '100px', sm: '150px' },
                alignItems: 'center',
                gap: '10px',
            }}
        >
            <StyledButton content={"Nouvelle flashcards"} onClick={onNewClick} color={currentMode === 'creating' ? "green" : "primary" } />
            <StyledButton content={"Supprimer flashcards"} color={currentMode === 'deleting' ? "#cc0000" : "primary"} onClick={onDelClick} />
            <StyledButton
                color={currentMode === "editing" ? "secondary" : "primary"}
                content={currentMode === "editing" ? "Editer flashcards" : "Consulter flashcards"}
                onClick={() => {
                    console.log("Edit button clicked");
                    onEditClick();
                }}
            />

        </Box>
    );
}
