import React, { useEffect, useState } from 'react';
import { CardContent, Typography, Box, TextField, Card } from '@mui/material';
import FavoriteButton from './FavoriteButton';
import { addFlashCardToCollection, getUserFlashcards, removeFlashCardToCollection } from '../API/FlashcardsAPI';
import { getTokenAndRole } from '../services/Cookie';
import { jwtDecode } from 'jwt-decode';
import { useParams } from 'react-router-dom';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';
import { handleOpenModal } from './FlashcardsUtils';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentQuestion, setCurrentReponse } from '../Slice/flashcardsSlice';
import { current } from '@reduxjs/toolkit';

export default function Flashcards({ data, isFlipped, onClick, isEditing, isAnswering, height = null, responseStatus = null }) {

    const { id_chap } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const currentFlashcard = useSelector(state => state.flashcards.currentFlashcard);
    const [user, setUser] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { token, role } = await getTokenAndRole();
                const decodedToken = jwtDecode(token);
                setUser(decodedToken);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const checkIfFavorite = async () => {
            if (!user || !data.id_flashcard || !id_chap) return;

            setIsLoading(true);
            try {
                const response = await getUserFlashcards(id_chap);
                const flashcardsArray = Array.isArray(response) ? response : [];

                const isInCollection = flashcardsArray.some(
                    flashcard => flashcard.id_flashcard === data.id_flashcard
                        && user.id_etudiant !== data.id_utilisateur
                );
                setIsFavorite(isInCollection);
            } catch (error) {
                console.error('Error checking favorite status:', error);
                setIsFavorite(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkIfFavorite();
    }, [id_chap, user, data]);

    return (
        <Box
            sx={{
                perspective: '1000px',
                width: { xs: 'inherit', sm: '100%' },
                height: height == null ? '200px' : height,
                cursor: 'pointer',
            }}
            onClick={data ? onClick : null}
        >

            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.6s, box-shadow 0.4s',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                    },
                }}
            >

                {/* Question */}
                <Card
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor:
                            responseStatus &&
                                responseStatus === true ? '#90EE90' :
                                responseStatus === false ? '#e70000' :
                                    data ? '#f5f5f5' :
                                        '#e70000',
                        borderRadius: '10px',
                        transform: 'rotateY(0deg)',
                    }}
                >

                    {isEditing ? (
                        <CardContent sx={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <TextField
                                rows={4}
                                variant="outlined"
                                value={data ? data.question : "Erreur"}
                                onChange={(e) => dispatch(setCurrentQuestion(e.target.value))}
                                fullWidth
                                multiline
                                label="Question"
                                onClick={(e) => e.stopPropagation()}
                                InputProps={{
                                    sx: {
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        textAlign: "center"
                                    }
                                }}
                            />
                        </CardContent>
                    ) : (
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {responseStatus ? "Correcte!" : responseStatus == false ? "Incorrect" : data ? data.question : "Erreur de chargement"}
                            </Typography>
                        </CardContent>
                    )}
                    {user !== null &&
                        data &&
                        data.id_utilisateur && (
                            user.id_etudiant === data.id_utilisateur && !isAnswering && !isEditing ? (
                                <>
                                    <EditButton data={data} />
                                    <DeleteButton data={data} />
                                </>
                            ) : (
                                data.question && !isEditing && (
                                    <FavoriteButton
                                        isFavorite={isFavorite}
                                        data={data}
                                        onFavorite={setIsFavorite}
                                        onClick={() => console.log("Favorite button clicked")}
                                    />
                                )
                            )
                        )}


                </Card>

                {/* Reponse */}
                <Card
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#d1e0e0',
                        borderRadius: '10px',
                        transform: 'rotateY(180deg)',
                    }}
                >
                    {isEditing || isAnswering ? (
                        <CardContent sx={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <TextField
                                rows={4}
                                variant="outlined"
                                value={isAnswering ? currentFlashcard.reponse : data ? data.reponse : "erreur"}
                                onChange={(e) => {
                                    dispatch(setCurrentReponse(e.target.value));

                                }}
                                fullWidth
                                multiline
                                label="Reponse"
                                onClick={(e) => e.stopPropagation()}
                                InputProps={{
                                    sx: {
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        textAlign: "center"
                                    }
                                }}
                            />
                        </CardContent>
                    ) : (
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {data ? data.reponse : "Erreur de chargement"}
                            </Typography>
                        </CardContent>
                    )}
                    {user !== null &&
                        data &&
                        data.id_utilisateur && (
                            user.id_etudiant === data.id_utilisateur && !isAnswering && !isEditing ? (
                                <>
                                    <EditButton data={data} />
                                    <DeleteButton data={data} />
                                </>
                            ) : (
                                data.question && !isEditing && (
                                    <FavoriteButton
                                        isFavorite={isFavorite}
                                        data={data}
                                        onFavorite={setIsFavorite}
                                        onClick={() => console.log("Favorite button clicked")}
                                    />
                                )
                            )
                        )}

                </Card>
            </Box>
        </Box>
    );
}
