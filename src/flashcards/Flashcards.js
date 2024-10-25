import React from 'react';
import { CardContent, Typography, Box, TextField } from '@mui/material';

export default function Flashcards({ data, isFlipped, onClick, isEditing, onChangeRecto, onChangeVerso }) {
    return (
        <Box
            sx={{
                perspective: '1000px',
                width: '100%',
                height: '200px',
                cursor: 'pointer',
            }}
            onClick={onClick} // Appel pour basculer la rotation
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
                {/* Recto */}
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
                        transform: 'rotateY(0deg)', // Toujours face avant
                    }}
                >
                    {isEditing ? (
                        <CardContent sx={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <TextField
                                rows={4}
                                variant="outlined"
                                value={data.recto}
                                onChange={(e) => onChangeRecto(e.target.value)}
                                fullWidth
                                multiline
                                label="Recto"
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
                                {data.recto}
                            </Typography>
                        </CardContent>
                    )}
                </Box>

                {/* Verso */}
                <Box
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
                        transform: 'rotateY(180deg)', // Rotation arrière
                    }}
                >
                    {isEditing ? (
                        <CardContent sx={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <TextField
                                rows={4}
                                variant="outlined"
                                value={data.verso}
                                onChange={(e) => onChangeVerso(e.target.value)}
                                fullWidth
                                multiline
                                label="Verso"
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
                                {data.verso}
                            </Typography>
                        </CardContent>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
