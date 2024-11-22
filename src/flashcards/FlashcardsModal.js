import React, { useEffect, useState } from 'react';
import { Modal, Box, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import StyledButton from '../composent/StyledBouton';
import Flashcards from './Flashcards';

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
    const [question, setRecto] = useState('');
    const [reponse, setVerso] = useState('');
    const [flipped, setFlipped] = useState(false);
    const [visibility, setVisibility] = useState(flashCardData ? flashCardData.visibilite : "public");

    const handleVisibilityChange = (event) => {
        setVisibility(event.target.value);
    };

    useEffect(() => {
        if (flashCardData) {
            setRecto(flashCardData.question);
            setVerso(flashCardData.reponse);
            setFlipped(false);
        } else {
            setRecto('');
            setVerso('');
        }
        console.log(flashCardData);
    }, [flashCardData]);

    const handleSave = () => {
        if(flashCardData)   {
            onSave( flashCardData.id_flashcard, question, reponse );
        } else {
            onSave( question, reponse, visibility );
        }
        onClose();
    };

    const handleFlip = () => {
        setFlipped((prev) => !prev);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={isEditing ? styleEdit : styleConsult}>
                {isEditing ?
                    <RadioGroup
                        row
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={visibility}
                        onChange={handleVisibilityChange}
                    >
                        <FormControlLabel
                            sx={{ color: 'white' }}
                            value="private"
                            control={<Radio sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} />}
                            label="Privé"
                        />
                        <FormControlLabel
                            sx={{ color: 'white' }}
                            value="public"
                            control={<Radio sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} />}
                            label="Publique"
                        />
                    </RadioGroup>
                    : null}
                <Flashcards
                    data={{ question, reponse }}
                    isFlipped={flipped}
                    isEditing={isEditing}
                    onChangeQuestion={setRecto}
                    onChangeReponse={setVerso}
                    onClick={handleFlip}
                    height={300}
                />
                {isEditing ?
                    <StyledButton variant="contained" color={"secondary"} content={"Enregistrer"} onClick={handleSave} />
                    : null}

            </Box>
        </Modal>
    );
}
