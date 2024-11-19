import React, { useEffect, useState } from 'react';
import { Modal, Box, Button } from '@mui/material';
import Flashcards from './Flashcards';
import StyledButton from '../composent/StyledBouton';

const styleEdit = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 300,
    bgcolor: '#093146',
    border: '2px solid #000',
    borderRadius: 10,
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
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
                    <StyledButton variant="contained" color={"secondary"} content={"Enregistrer"} onClick={handleSave} />
                         : null}

            </Box>
        </Modal>
    );
}
