import React, { useEffect, useState } from 'react';
import { CardContent, Typography, Box, TextField, Card } from '@mui/material';
import FavoriteButton from '../composent/FavoriteButton';
import { addFlashCardToCollection, getUserFlashcards, removeFlashCardToCollection } from '../API/FlashcardsAPI';
import { getTokenAndRole } from '../services/Cookie';
import { jwtDecode } from 'jwt-decode';
import { useParams } from 'react-router-dom';

export default function Flashcards({ data, isFlipped, onClick, isEditing, isAnswering, onChangeQuestion, onChangeReponse, height = null, onRemoveFromCollection = null }) {

    const { id_chap } = useParams();
    const [isFavorite, setIsFavorite] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    console.log("Flashcards.js: data", data, isAnswering, isEditing);

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
    }, [id_chap, user, data.id_flashcard]);

    const handleToggleFavorite = async () => {
        if (isLoading) return;
        
        try {
            if (isFavorite) {
                await removeFlashCardToCollection(data.id_flashcard);
                onRemoveFromCollection();
                setIsFavorite(false);
            } else {
                await addFlashCardToCollection(data.id_flashcard);
                setIsFavorite(true);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    return (
        <Box
            sx={{
                perspective: '1000px',
                width: {xs:'inherit', sm:'100%'},
                height: height == null ? '200px' : height,
                cursor: 'pointer',
            }}
            onClick={onClick}
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
                        backgroundColor: '#f5f5f5',
                        borderRadius: '10px',
                        transform: 'rotateY(0deg)',
                    }}
                >
                    {isEditing ? (
                        <CardContent sx={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <TextField
                                rows={4}
                                variant="outlined"
                                value={data.question}
                                onChange={(e) => onChangeQuestion(e.target.value)}
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
                                {data.question}
                            </Typography>
                        </CardContent>
                    )}
                    {user !== null && data.id_utilisateur !== user.id_etudiant && (
                        <FavoriteButton
                            
                            isFavorite={isFavorite}
                            onToggleFavorite={handleToggleFavorite}
                        />
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
                                value={data.reponse}
                                onChange={(e) => onChangeReponse(e.target.value)}
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
                                {data.reponse}
                            </Typography>
                        </CardContent>
                    )}
                    {user !== null && data.id_utilisateur !== user.id_etudiant && (
                        <FavoriteButton
                            isFavorite={isFavorite}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    )}
                </Card>
            </Box>
        </Box>
    );
}
