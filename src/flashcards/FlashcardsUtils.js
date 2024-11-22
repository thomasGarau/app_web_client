export const handleFlipCard = (index, setFlashCards) => {
    setFlashCards((prevList) =>
        prevList.map((card, i) =>
            i === index ? { ...card, isFlipped: !card.isFlipped } : card
        )
    );
};

export const handleCloseModal = (setIsModalOpen, setSelectedFlashCard, MODES, setCurrentMode) => {
    setIsModalOpen(false);
    setSelectedFlashCard(null);
    setCurrentMode(MODES.CONSULTING);
};

export const handleOpenModal = (setSelectedFlashCard, setCurrentMode, setIsModalOpen, MODES, flashCard = null) => {
    if (flashCard) {
        setSelectedFlashCard(flashCard);
    } else {
        setCurrentMode(MODES.CREATING);
    }
    setIsModalOpen(true);
};
