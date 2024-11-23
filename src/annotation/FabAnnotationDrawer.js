import React, { useCallback } from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import CommentIcon from '@mui/icons-material/Comment';


export default function FabAnnotationDrawer({ handleDrawerOpen }) {


    return (
        <Box>
            <Fab
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                onClick={handleDrawerOpen}
                color="primary"
                aria-label="add"
            >
                <CommentIcon />
            </Fab>
        </Box>
    );
}