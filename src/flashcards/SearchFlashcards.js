import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAllFlashcards } from "../API/FlashcardsAPI";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import FlashcardsDisplayer from "./FlashcardsDisplayer";
import { Box, Typography } from "@mui/material";
import Fuse from 'fuse.js';
import FlashCardsModal from "./FlashcardsModal";
import { useDispatch, useSelector } from "react-redux";
import { setFlashcards } from "../Slice/flashcardsSlice";
import { handleOpenModal } from "./FlashcardsUtils";

function SearchFlashcards() {


    const { id_chap } = useParams();
    const [search, setSearch] = useState('');
    const flashcards = useSelector(state => state.flashcards.flashcards);
    const modalState = useSelector(state => state.flashcards.modalState);
    const [searchResults, setSearchResults] = useState(flashcards);
    const dispatch = useDispatch();

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
            dispatch(setFlashcards(response));
        };

        fetchFlashcards();
    }, []);


    return (
        <div style={{
            position: 'relative',
            top: 150,
            display: 'flex',
            flexFlow: 'column wrap',
            overflow: 'auto',
        }}>
            <Box sx={{
                width: { xs: '90%', md: '50%' },
                zIndex: 1,
                marginLeft: 2,
                position: 'relative',
                display: "flex",
                flexDirection: 'column',

            }}>
                <Typography variant="h4" gutterBottom>
                    Parcourez les flashcards!
                </Typography>
                <ReactSearchAutocomplete
                    items={searchResults}
                    onSearch={(value) => setSearch(value)}
                    onSelect={handleOnSelect}
                    placeholder="Rechercher des flashcards"
                />
            </Box>
            <FlashcardsDisplayer
                CorS={'S'}
                flashCardsList={searchResults.length > 0 ? searchResults : flashcards}

            />
            <FlashCardsModal />
        </div>
    );
}

export default SearchFlashcards;