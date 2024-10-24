import React, { useState } from 'react';
import { Box, Button, TextField, Accordion, AccordionSummary, AccordionDetails, Typography, Select, MenuItem } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StyledButton from '../composent/StyledBouton';

const FlashCardDrawer = ({ onSave, collections }) => {
    const [recto, setRecto] = useState('');
    const [verso, setVerso] = useState('');
    const [expanded, setExpanded] = useState(false); // État pour gérer si l'accordion est étendu ou non
    const [selectedCollection, setSelectedCollection] = useState(''); // Sélection de la collection

    const handleSave = () => {
        if (recto && verso && selectedCollection) {
            onSave({ recto, verso, collectionId: selectedCollection });
            setRecto(''); // Réinitialiser le formulaire après sauvegarde
            setVerso('');
            setSelectedCollection(''); // Réinitialiser la sélection de collection
        }
    };

    const handleToggleAccordion = () => {
        setExpanded(!expanded); // Bascule l'état d'ouverture/fermeture de l'accordion
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
                    backgroundColor: '#f0f0f0',
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
                    <Typography>{expanded ? "Créer Flashcard" : null}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <TextField
                            label="Recto"
                            variant="outlined"
                            fullWidth
                            value={recto}
                            onChange={(e) => setRecto(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Verso"
                            variant="outlined"
                            fullWidth
                            value={verso}
                            onChange={(e) => setVerso(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        {/* Select pour choisir une collection */}
                        <Select
                            value={selectedCollection}
                            onChange={(e) => setSelectedCollection(e.target.value)}
                            displayEmpty
                            fullWidth
                            sx={{ mb: 2 }}
                        >
                            <MenuItem value="" disabled>Sélectionnez une collection</MenuItem>
                            {collections.map((collection) => (
                                <MenuItem key={collection.id} value={collection.id}>
                                    {collection.name}
                                </MenuItem>
                            ))}
                        </Select>

                        <StyledButton content={"Enregistrer"} width={250} color={"primary"} onClick={handleSave} />
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default FlashCardDrawer;
