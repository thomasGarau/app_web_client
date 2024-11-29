import { Box, Pagination, useMediaQuery } from '@mui/material';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import FlashcardsBox from './FlashcardsBox';
import { handleFlipCard } from './FlashcardsUtils';

export default function FlashcardsDisplayer({ flashCardsList, CorS}) { 

    const [flashCards, setFlashCards] = useState(flashCardsList);
    console.log(flashCardsList);
    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage, setCardsPerPage] = useState(() => {
        const screenWidth = window.innerWidth;
        if (screenWidth < 600) return 4;
        if (screenWidth < 1024) return 6;
        return 8;
    });

    const isSmallScreen = useMediaQuery('(max-width:600px)'); 

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth < 600) setCardsPerPage(4);
            else if (screenWidth < 1024) setCardsPerPage(6);
            else setCardsPerPage(8);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const paginationData = useMemo(() => {
        if (typeof flashCardsList !== "string") {
            const totalCards = flashCardsList.length;
            const totalPages = Math.ceil(totalCards / cardsPerPage);

            const adjustedCurrentPage = Math.min(currentPage, totalPages);

            const indexOfLastCard = adjustedCurrentPage * cardsPerPage;
            const indexOfFirstCard = indexOfLastCard - cardsPerPage;

            const currentCards = flashCardsList.slice(indexOfFirstCard, indexOfLastCard);
            return {
                totalPages,
                currentCards,
                adjustedCurrentPage
            };
        }

    }, [flashCardsList, currentPage, cardsPerPage]);

    const callFlipCard = (index) => {
        handleFlipCard(index, setFlashCards)
    };

    const handlePageChange = useCallback((_, value) => {
        setCurrentPage(value);
    }, []);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <FlashcardsBox
                CorS={CorS}
                flashCards={paginationData ? paginationData.currentCards: null}
            />
            {!isSmallScreen && (
                <Pagination
                    count={paginationData ? paginationData.totalPages: null}
                    page={paginationData ? paginationData.adjustedCurrentPage : null}
                    onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
                    sx={{
                        marginTop: '16px', display: 'flex',
                        justifyContent: 'center',
                        position: 'fixed',
                        right: '50%',
                        bottom: '170px',
                        transform: 'translateX(50%)',
                        margin: '30px 0px'
                    }}
                />
            )}
        </Box>
    );
}
