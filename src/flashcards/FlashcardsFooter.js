import { Box } from '@mui/material';
import StyledButton from '../composent/StyledBouton';
import React from 'react';

export default function FlashcardsFooter({ onNewClick, onEditClick, consultingMode }) {
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
                height: '200px',
                alignItems: 'center',
                gap: '10px',
                padding: '10px'
            }}
        >
            <StyledButton content={"Nouvelle flashcards"} color={"primary"} onClick={onNewClick} />
            <StyledButton content={consultingMode ? "Editer flashcards" : "Consulter flashcards"} color={consultingMode ? "primary" : "secondary"} onClick={onEditClick} />
        </Box>
    );
}
