import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import FlashCardsModal from '../flashcards/FlashcardsModal';
import { handleCloseModal, handleOpenModal } from './FlashcardsUtils';
import { useDispatch, useSelector } from 'react-redux';

const EditButton = ({ data, onClick, size = 'medium' }) => {

    const isModalOpen = useSelector(state => state.flashcards.modalState);
    const dispatch = useDispatch();

    return (
        <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                zIndex: 1000,
            }}
        >
            <IconButton
                onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(data, false, true, dispatch);
                }}
                aria-label="Edit flashcard"
                size={size}
            >
                <EditIcon />
            </IconButton>
        </Box>
    );
};

export default EditButton;