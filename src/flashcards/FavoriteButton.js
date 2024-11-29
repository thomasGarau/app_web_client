import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { addFlashCardToCollection, removeFlashCardToCollection } from '../API/FlashcardsAPI';
import { fetchMyCollection } from './FlashcardsUtils';
import { useDispatch } from 'react-redux';

const FavoriteButton = ({ isLoading, onFavorite, isFavorite, data, size = 'medium' }) => {

    const dispatch = useDispatch();

    const handleToggleFavorite = async () => {
        if (isLoading) return;
        try {
            if (isFavorite) {
                await removeFlashCardToCollection(data.id_flashcard);
                onFavorite(false);
            } else {
                await addFlashCardToCollection(data.id_flashcard);
                onFavorite(true);
            }
            await fetchMyCollection(data.id_chapitre, dispatch);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    return (
        <Box
            onClick={(e) => e.stopPropagation()}
            sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1000 }}
            >
            <IconButton
                onClick={handleToggleFavorite}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                size={size}
            >
                {isFavorite ? (
                    <FavoriteIcon color="error" />
                ) : (
                    <FavoriteBorderIcon />
                )}
            </IconButton>
        </Box>
    );
};

export default FavoriteButton;