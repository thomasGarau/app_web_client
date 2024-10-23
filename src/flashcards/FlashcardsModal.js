import React, { useEffect, useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function FlashCardsModal({ open, onClose, flashCardData, onSave }) {
    const [recto, setRecto] = useState('');
    const [verso, setVerso] = useState('');

    useEffect(() => {
        if (flashCardData) {
            setRecto(flashCardData.recto);
            setVerso(flashCardData.verso);
        } else {
            setRecto('');
            setVerso('');
        }
    }, [flashCardData]);

    const handleSave = () => {
        onSave({ recto, verso });
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <TextField
                    label="Recto"
                    variant="outlined"
                    fullWidth
                    value={recto}
                    onChange={(e) => setRecto(e.target.value)}
                />
                <TextField
                    label="Verso"
                    variant="outlined"
                    fullWidth
                    value={verso}
                    onChange={(e) => setVerso(e.target.value)}
                    sx={{ mt: 2 }}
                />
                <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
                    Enregistrer
                </Button>
            </Box>
        </Modal>
    );
}
