import React, { useEffect, useState } from 'react';
import { Modal, Box, RadioGroup, Radio, FormControlLabel, useMediaQuery } from '@mui/material';
import StyledButton from '../composent/StyledBouton';
import Flashcards from './Flashcards';
import { createFlashcard, flashcardAnswer, updateFlashcard } from '../API/FlashcardsAPI';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentQuestion, setCurrentReponse, setFlashcards } from '../Slice/flashcardsSlice';
import { fetchMyCollection, handleCloseModal } from './FlashcardsUtils';

const baseStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
};

const styleEdit = {
    ...baseStyle,
    bgcolor: '#093146',
    border: '2px solid #000',
    borderRadius: 10,
    boxShadow: 24,
};

const styleConsult = {
    ...baseStyle,
    bgcolor: '#ffffff00',
};

export default function FlashCardsModal() {

    const [flipped, setFlipped] = useState(false);
    const currentFlashcard = useSelector(state => state.flashcards.currentFlashcard);
    const modalState = useSelector(state => state.flashcards.modalState);
    const [visibility, setVisibility] = useState(currentFlashcard ? currentFlashcard.visibilite : "public");
    const dispatch = useDispatch();
    const isLandscape = useMediaQuery('(orientation: landscape)');
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const [responseStatus, setResponseStatus] = useState(null); 


    const modalStyle = (baseStyle) => ({
        ...baseStyle,
        width: isSmallScreen
            ? (isLandscape ? '90vh' : '90vw')
            : 600,
        height: isSmallScreen
            ? (isLandscape ? '90vw' : '60vh')
            : 300,
        transform: isSmallScreen
            ? (isLandscape
                ? 'translate(-50%, -50%) rotate(90deg)'
                : 'translate(-50%, -50%)')
            : 'translate(-50%, -50%)',
    });

    const handleVisibilityChange = (value) => {
        setVisibility(value);
    };

    useEffect(() => {
        if (currentFlashcard) {
            dispatch(setCurrentQuestion(currentFlashcard.question));
            if (modalState.isAnswering !== null && modalState.isAnswering === true) {
                dispatch(setCurrentReponse(""));
            }

        }
    }, [modalState.isAnswering]);

    const handleSave = async () => {
        try {
            if (modalState.isAnswering) {
                // Compare answers and set status
                const data = await flashcardAnswer(currentFlashcard.id_flashcard, currentFlashcard.reponse);
                console.log(data);
                setResponseStatus(data);
                return;
            }
            if (currentFlashcard && !currentFlashcard.new) {
                await updateFlashcard(currentFlashcard.id_flashcard, currentFlashcard.question, currentFlashcard.reponse);
            } else {
                (console.log(visibility, currentFlashcard.id_chapitre, currentFlashcard.question, currentFlashcard.reponse));
                await createFlashcard(currentFlashcard.id_chapitre, currentFlashcard.question, currentFlashcard.reponse, visibility);
            }
            await fetchMyCollection(currentFlashcard.id_chapitre, dispatch);
            handleCloseModal(dispatch);
        } catch (error) {
            console.error('Error saving flashcard:', error);
        }
    };

    const handleFlip = () => {
        setFlipped((prev) => !prev);
    };

    return (
        <Modal open={modalState.isModalOpen} onClose={() => handleCloseModal(dispatch)}>
            <Box sx={modalStyle(modalState.isEditing || modalState.isAnswering ? styleEdit : styleConsult)}>
                {modalState.isEditing ?
                    <RadioGroup
                        row
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={visibility}
                        onChange={(e) => handleVisibilityChange(e.target.value)}
                    >
                        <FormControlLabel
                            sx={{ color: 'white' }}
                            value="prive"
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
                    data={currentFlashcard}
                    isFlipped={flipped}
                    isAnswering={modalState.isAnswering}
                    isEditing={modalState.isEditing}
                    onClick={handleFlip}
                    height={300}
                    responseStatus={responseStatus}
                />
                {modalState.isEditing || modalState.isAnswering ?
                    <StyledButton variant="contained" color={"secondary"} content={modalState.isAnswering ? "Valider" : "Enregistrer"} onClick={() => handleSave()} />
                    : null}

            </Box>
        </Modal>
    );
}
