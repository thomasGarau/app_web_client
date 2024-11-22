import React, { useEffect, useState } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography, Select, MenuItem, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StyledButton from '../composent/StyledBouton';
import Flashcards from '../flashcards/Flashcards';

const FlashCardDrawer = ({ onSave }) => {
    const [question, setQuestion] = useState('');
    const [reponse, setReponse] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState('');
    const [flipped, setFlipped] = useState(false);
    const [visibility, setVisibility] = useState("public");

    const handleVisibilityChange = (event) => {
        setVisibility(event.target.value);
    };

    const handleSave = () => {
        if (question && reponse) {
            onSave(question, reponse, visibility);
            setQuestion('');
            setReponse('');
        }
    };

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
                width: expanded ? { xl: '200px', sm: '400px' } : '50px',
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
                        <Flashcards
                            data={{ question, reponse }}
                            isFlipped={flipped}
                            isEditing={true}
                            onChangeQuestion={(newQuestion) => setQuestion(newQuestion)}
                            onChangeReponse={(newReponse) => setReponse(newReponse)}
                            onClick={handleFlip}
                        />
                        <StyledButton content={"Enregistrer"} width={250} color={"secondary"} onClick={handleSave} />
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default FlashCardDrawer;
