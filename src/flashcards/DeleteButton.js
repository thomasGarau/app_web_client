import React, { useCallback } from 'react';
import { Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteFlashcard } from '../API/FlashcardsAPI';
import { useDispatch } from 'react-redux';
import { fetchMyCollection, handleCloseModal } from './FlashcardsUtils';

const DeleteButton = ({ data, onClick, size = 'medium' }) => {


    const dispatch = useDispatch();

    const removeFlashcard = useCallback(async () => {   
        try {
            await deleteFlashcard(data.id_flashcard);
            await fetchMyCollection(data.id_chapitre, dispatch);
            handleCloseModal(dispatch);
        } catch (error) {
            console.error(error);
        }
    }, [data]);


    return (
        <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
                position: 'absolute',
                top: 0,
                right: 40,
                zIndex: 1000,
                transform: 'rotateY(0deg)',
                backfaceVisibility: 'hidden'
            }}
        >
            <IconButton
                onClick={removeFlashcard}
                aria-label="Delete flashcard"
                size={size}
            >
                <DeleteIcon />
            </IconButton>
        </Box>
    );
};

export default DeleteButton;