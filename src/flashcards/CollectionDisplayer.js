import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Fab, useMediaQuery } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createFlashcard, deleteFlashcard } from '../API/FlashcardsAPI';
import FlashcardsDisplayer from './FlashcardsDisplayer';
import FlashCardsModal from './FlashcardsModal';
import FlashcardsFooter from './FlashcardsFooter';
import { getTokenAndRole } from '../services/Cookie';
import { jwtDecode } from 'jwt-decode';
import StyledButton from '../composent/StyledBouton';
import { fetchMyCollection, handleCloseModal } from './FlashcardsUtils';

const CollectionDisplayer = () => {

    const { id_chap } = useParams();
    const [user, setUser] = useState(null);
    const flashcards = useSelector(state => state.flashcards.flashcards);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        const fetchData = async () => {
            const { token, role } = await getTokenAndRole();
            const decodedToken = jwtDecode(token);
            setUser(decodedToken.id_etudiant);
        };
        fetchData();
    }, []);

    useEffect(() => {

        fetchMyCollection(parseInt(id_chap), dispatch);
    }, [id_chap, dispatch]);


    const newFlashcard = useCallback(async (question, reponse, visibilite) => {
        try {
            await createFlashcard(id_chap, question, reponse, visibilite);
            await fetchMyCollection(id_chap, dispatch);
        } catch (error) {
            console.error(error);
        }
    }, [id_chap]);

    const toSearch = () => {
        navigate(`/search_flashcards/${id_chap}`);
    };

    return (
        <Box sx={{
            position: 'relative',
            top: 150,
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            overflow: 'auto',
            flexGrow: 1,
            paddingBottom: { xs: '120px', sm: '170px' },
            flexWrap: 'wrap',
        }}>
            <Box sx={{
                display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: 2, alignItems: 'center'
            }}>
                <Typography sx={{ marginLeft: 2 }} variant="h4" gutterBottom>
                    Ma collection de flashcards
                </Typography>
                {isSmallScreen ? (
                    <Fab
                        color="primary"
                        aria-label="search"
                        onClick={() => toSearch()}
                        sx={{
                            position: 'fixed',
                            bottom: 125,
                            right: 16
                        }}
                    >
                        <SearchIcon />
                    </Fab>
                ) : (
                    <StyledButton
                        content={'Chercher des flashcards'}
                        width={350}
                        color={'primary'}
                        onClick={() => toSearch()}
                    />
                )}
            </Box>
            {flashcards && (
                <FlashcardsDisplayer
                    CorS={'C'}
                    flashCardsList={flashcards}
                />
            )}

            {/* Modal pour ajouter ou éditer une flashcard */}
            <FlashCardsModal />
        </Box>
    );
};

export default CollectionDisplayer;
