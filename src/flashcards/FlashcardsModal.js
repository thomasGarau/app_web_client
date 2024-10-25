import React, { useEffect, useState } from 'react';
import { Modal, Box, Button } from '@mui/material';
import Flashcards from './Flashcards';

const styleEdit = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 300,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const styleConsult = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 300,
    bgcolor: '#ffffff00',
    p: 4,
};

export default function FlashCardsModal({ open, onClose, flashCardData, onSave = null, isEditing = null }) {
    const [recto, setRecto] = useState('');
    const [verso, setVerso] = useState('');
    const [flipped, setFlipped] = useState(false);

    useEffect(() => {
        if (flashCardData) {
            setRecto(flashCardData.recto);
            setVerso(flashCardData.verso);
            setFlipped(false); // Réinitialise l'état de rotation au moment de l'ouverture
        } else {
            setRecto('');
            setVerso('');
        }
    }, [flashCardData]);

    const handleSave = () => {
        onSave({ recto, verso });
        onClose();
    };

    const handleFlip = () => {
        setFlipped((prev) => !prev);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={isEditing ? styleEdit : styleConsult}>
                <Flashcards
                    data={{ recto, verso }}
                    isFlipped={flipped}
                    isEditing={isEditing}
                    onChangeRecto={(newRecto) => setRecto(newRecto)}
                    onChangeVerso={(newVerso) => setVerso(newVerso)}
                    onClick={handleFlip}
                />
                {isEditing ?
                    <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
                        Enregistrer
                    </Button> : null}

            </Box>
        </Modal>
    );
}
