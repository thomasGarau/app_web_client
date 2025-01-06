import React, { useEffect, useState } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography, Select, MenuItem, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StyledButton from '../composent/StyledBouton';
import Flashcards from '../flashcards/Flashcards';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentFlashcard } from '../Slice/flashcardsSlice';
import { createFlashcard } from '../API/FlashcardsAPI';

const FlashCardDrawer = ({ open, chapterId, onClose }) => {
    const [question, setQuestion] = useState('');
    const [reponse, setReponse] = useState('');
    const [expanded, setExpanded] = useState(false);
    const emptyFlashcard = {
        id_chapitre: chapterId,
        question: '',
        reponse: '',
        new: true,
    };
    const dispatch = useDispatch();
    const currentFlashcard = useSelector(state => state.flashcards.currentFlashcard);
    
    const [flipped, setFlipped] = useState(false);
    const [visibility, setVisibility] = useState("public");

    const handleVisibilityChange = (event) => {
        setVisibility(event.target.value);
    };

    const handleSaveFlashCard = async () => {
        try {
            await createFlashcard(chapterId, currentFlashcard.question, currentFlashcard.reponse, visibility);
            dispatch(setCurrentFlashcard(emptyFlashcard))
            setExpanded(false);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        dispatch(setCurrentFlashcard(emptyFlashcard));
    }, [chapterId])

    const handleToggleAccordion = () => {
        setExpanded(!expanded);
    };

    const handleFlip = () => {
        setFlipped((prev) => !prev);
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                right: 0,
                top: '40%',
                transform: 'translateY(-50%)',
                zIndex: 1000,
                width: expanded ? { xl: '400px', sm: '400px' } : '50px',
                transition: '0.3s ease',
                maxHeight: '64px',
            }}
        >
            <Accordion
                expanded={expanded}
                onChange={handleToggleAccordion}
                sx={{
                    boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                    '&:before': {
                        display: 'none',
                    },
                    borderRadius: expanded ? '20px 0px 0px 20px !important' : '50px 0px 0px 50px !important',
                    backgroundColor: '#133D56',
                    transition: 'border-radius 0.3s ease',
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ transform: 'rotate(0.25turn)' }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{
                        borderRadius: expanded ? '20px 0px 0px 0px !important' : '50px 0px 0px 0px !important',
                    }}
                >
                    <Typography sx={{color: "white"}}>{expanded ? "Créer Flashcard" : null}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <RadioGroup
                            row
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={visibility}
                            onChange={handleVisibilityChange}
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
                        <Flashcards
                            data={currentFlashcard}
                            isFlipped={flipped}
                            isEditing={true}
                            isAnswering={false}
                            onClick={handleFlip}
                        />
                        <StyledButton content={"Enregistrer"} width={250} color={"secondary"} onClick={handleSaveFlashCard} />
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default FlashCardDrawer;
