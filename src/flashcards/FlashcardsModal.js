import React, { useEffect, useState } from 'react';
import { Modal, Box, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import StyledButton from '../composent/StyledBouton';
import Flashcards from './Flashcards';
import { flashcardAnswer } from '../API/FlashcardsAPI';

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

export default function FlashCardsModal({ open, onClose, flashCardData, onSave = null, isEditing = null, isAnswering = null }) {
    const [question, setQuestion] = useState('');
    const [reponse, setReponse] = useState('');
    const [flipped, setFlipped] = useState(false);
    const [visibility, setVisibility] = useState(flashCardData ? flashCardData.visibilite : "public");

    const handleVisibilityChange = (event) => {
        setVisibility(event.target.value);
    };

    useEffect(() => {
        if (flashCardData) {
            setQuestion(flashCardData.question);
            if (isAnswering !== null && !isAnswering) {
                setReponse(flashCardData.reponse);
            } else {
                setReponse('');
            }
            setFlipped(false);
        } else {
            setQuestion('');
            setReponse('');
        }
        console.log(reponse);
    }, [flashCardData, isAnswering]);

    const handleSave = async () => {
        if (isAnswering) {
            await flashcardAnswer(flashCardData.id_flashcard, reponse)
            isAnswering = false;
        }
        else {
            if (flashCardData) {
                onSave(flashCardData.id_flashcard, question, reponse);
            } else {
                onSave(question, reponse, visibility);
            }
        }
        onClose();
    };

    const handleFlip = () => {
        setFlipped((prev) => !prev);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={isEditing || isAnswering ? styleEdit : styleConsult}>
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
                    isAnswering={isAnswering}
                    isEditing={isEditing}
                    onChangeQuestion={setQuestion}
                    onChangeReponse={setReponse}
                    onClick={handleFlip}
                    height={300}
                />
                {isEditing || isAnswering ?
                    <StyledButton variant="contained" color={"secondary"} content={isAnswering ? "Valider" : "Enregistrer"} onClick={handleSave} />
                    : null}

            </Box>
        </Modal>
    );
}
