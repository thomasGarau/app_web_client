import React from 'react';
import { CardContent, Typography, Box } from '@mui/material';

export default function Flashcards({ data, isFlipped, onClick }) {
    return (
        <Box
            sx={{
                perspective: '1000px',
                width: '100%',
                height: '200px',
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
                <Box
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
                    }}
                >
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {data.recto}
                        </Typography>
                    </CardContent>
                </Box>

                <Box
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#eeeeee',
                        borderRadius: '10px',
                        transform: 'rotateY(180deg)',
                    }}
                >
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {data.verso}
                        </Typography>
                    </CardContent>
                </Box>
            </Box>
        </Box>
    );
}
