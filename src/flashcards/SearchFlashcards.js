import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAllFlashcards } from "../API/FlashcardsAPI";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import FlashcardsDisplayer from "./FlashcardsDisplayer";
import { Typography } from "@mui/material";
import Fuse from 'fuse.js';
import FlashCardsModal from "./FlashcardsModal";

function SearchFlashcards() {
    const MODES = {
        CONSULTING: 'consulting',
        EDITING: 'editing',
        DELETING: 'deleting',
        CREATING: 'creating'
    };
    const { id_chap } = useParams();
    const [search, setSearch] = useState('');
    const [flashcards, setFlashcards] = useState([]);
    const [searchResults, setSearchResults] = useState(flashcards);
    const [selectedFlashCard, setSelectedFlashCard] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMode, setCurrentMode] = useState(MODES.CONSULTING);
    const fuseOptions = {
        keys: ['question', 'reponse'],
        includeScore: true,
        threshold: 0.3,
    };
    const fuse = new Fuse(flashcards, fuseOptions);

    const handleOnSelect = (item) => {
        console.log(item);
    };


    useEffect(() => {
        if (search.trim() === '') {
            const filteredFlashcards = flashcards.filter(flashcard =>
                flashcard.visibilite !== 'orphelin'
            );
            setSearchResults(filteredFlashcards);
        } else {
            const results = fuse.search(search)
                .map(result => result.item)
                .filter(flashcard => flashcard.visibilite !== 'orphelin')
                .filter(flashcard => flashcard.visibilite !== 'private');
            setSearchResults(results);
        }
    }, [search, flashcards]);

    useEffect(() => {
        const fetchFlashcards = async () => {
            const response = await getAllFlashcards(id_chap);
            setFlashcards(response);
        };

        fetchFlashcards();
    }, []);

    const handleOpenModal = (flashCard = null) => {
        if (flashCard) {
            setSelectedFlashCard(flashCard);

        } else {
            setCurrentMode(MODES.CREATING);
        }
        setIsModalOpen(true);

    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedFlashCard(null);
        setCurrentMode(MODES.CONSULTING);
    };


    return (
        <div style={{ position: 'relative', top: 150 }}>
            <div style={{ width: "50%", zIndex: 2, marginLeft: 15, position: 'relative' }}>
                <Typography variant="h4" gutterBottom>
                    Parcourez les flashcards!
                </Typography>
                <ReactSearchAutocomplete
                    items={searchResults}
                    onSearch={(value) => setSearch(value)}
                    onSelect={handleOnSelect}
                    placeholder="Rechercher des flashcards"
                />
            </div>
            <FlashcardsDisplayer
                flashCardsList={searchResults.length > 0 ? searchResults : flashcards}
                currentMode={'consulting'}
                handleOpenModal={handleOpenModal}
                id_chap={id_chap}

            />
            <FlashCardsModal
                open={isModalOpen}
                onClose={handleCloseModal}
                flashCardData={selectedFlashCard}
                isEditing={false}
            />
        </div>
    );
}

export default SearchFlashcards;