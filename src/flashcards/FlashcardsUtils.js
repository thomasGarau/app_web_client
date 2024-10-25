export const handleFlipCard = (index, setFlashCards) => {
    setFlashCards((prevList) =>
        prevList.map((card, i) =>
            i === index ? { ...card, isFlipped: !card.isFlipped } : card
        )
    );
};

export const handleCloseModal = (setIsModalOpen, setSelectedFlashCard) => {
    setIsModalOpen(false);
    setSelectedFlashCard(null);
};