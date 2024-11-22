import React from 'react';
import { CardContent, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const FavoriteButton = ({ isFavorite, onToggleFavorite, size = 'medium' }) => {
    return (
        <CardContent
            onClick={(e) => e.stopPropagation()}
            sx={{ position: 'absolute', top: 0, right: 0 }}
            >
            <IconButton
                onClick={onToggleFavorite}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                size={size}
            >
                {isFavorite ? (
                    <FavoriteIcon color="error" />
                ) : (
                    <FavoriteBorderIcon />
                )}
            </IconButton>
        </CardContent>
    );
};

export default FavoriteButton;