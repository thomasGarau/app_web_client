import { Box } from '@mui/material';
import React, { useState } from 'react';
import Flashcards from './Flashcards';
import FlashcardsFooter from './FlashcardsFooter';
import FlashCardsModal from './FlashcardsModal';


export default function FlashcardsDisplayer() {
    const [flashCardsList, setFlashCardsList] = useState([
        { recto: "au pif", verso: "Et ouais", isFlipped: false },
        { recto: "migate...", verso: "...no gokui", isFlipped: false },
        { recto: "Gear", verso: "5th", isFlipped: false }
    ]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [consultingMode, setConsultingMode] = useState(true);
    const [selectedFlashCard, setSelectedFlashCard] = useState(null);

    const handleOpenModal = (flashCard = null) => {
        setSelectedFlashCard(flashCard);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedFlashCard(null);
    };

    const handleSaveFlashCard = (newFlashCard) => {
        if (selectedFlashCard) {
            setFlashCardsList((prevList) =>
                prevList.map((card) =>
                    card === selectedFlashCard ? newFlashCard : card
                )
            );
        } else {

            setFlashCardsList((prevList) => [...prevList, newFlashCard]);
        }
    };

    const handleChangeMode = () => {
        setConsultingMode(!consultingMode);
    };

    const handleFlipCard = (index) => {
        setFlashCardsList((prevList) =>
            prevList.map((card, i) =>
                i === index ? { ...card, isFlipped: !card.isFlipped } : card
            )
        );
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Box
                sx={{
                    position: 'relative',
                    top: '150px',
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',        
                        sm: 'repeat(2, 1fr)', 
                        md: 'repeat(3, 1fr)', 
                        lg: 'repeat(4, 1fr)' 
                    },
                    gap: { xs: '20px 0px', sm: '20px' }, 
                    padding: { xs: '16px 0px', sm: '16px' } 
                }}
            >
                {flashCardsList.map((flashCard, index) => (
                    <Flashcards 
                        key={index} 
                        data={flashCard} 
                        isFlipped={flashCard.isFlipped} 
                        onClick={consultingMode ? () => handleFlipCard(index) : () => handleOpenModal(flashCard)} 
                    />
                ))}
            </Box>

            <FlashcardsFooter
                onNewClick={() => handleOpenModal()}
                onEditClick={() => handleChangeMode()}
                consultingMode={consultingMode}
            />

            {/* Modal pour ajouter ou éditer une flashcard */}
            <FlashCardsModal
                open={isModalOpen}
                onClose={handleCloseModal}
                flashCardData={selectedFlashCard}
                onSave={handleSaveFlashCard}
            />
        </Box>
    );
}
