import { Avatar, Box, Typography, IconButton, Button, TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import React, { useState, useRef, useEffect } from 'react';
import { createAnnotationResponse, getAnnotationResponses, removeAnnotation, removeAnnotationResponse, updateAnnotation, updateAnnotationResponse, updateAnnotationState } from "../API/AnnotationAPI";
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedAnnotation, updateAnnotationRedux } from "../Slice/annotationSlice";
import Draggable from 'react-draggable';

function Annotation() {
    const dispatch = useDispatch();
    const selectedAnnotation = useSelector(state => state.annotation.selectedAnnotation);
    const [responseMode, setResponseMode] = useState(false);
    const [answer, setAnswer] = useState('');
    const [responses, setResponses] = useState([]);
    const [isEditingAnnotation, setIsEditingAnnotation] = useState(false);
    const [editedAnnotation, setEditedAnnotation] = useState(selectedAnnotation?.contenu || '');
    const [editingResponseId, setEditingResponseId] = useState(null);
    const [editedResponse, setEditedResponse] = useState('');
    const boxRef = useRef(null);
    const user = {
        nom: "Doe",
        prenom: "John"
    };

    const formatDate = (dateString) => {
        const date = parseISO(dateString);
        return format(date, "HH:mm dd MMMM yyyy", {
            locale: fr
        });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (boxRef.current && !boxRef.current.contains(event.target)) {
                setResponseMode(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAddAnswer = async () => {
        if (!answer || answer.trim() === '') {
            return;
        }
        try {
            await createAnnotationResponse(selectedAnnotation.id_annotation, answer);
            setAnswer('');
            setResponseMode(false);
        } catch (error) {
            console.error('Error submitting response:', error);
        }
    }

    useEffect(() => {
        const fetchResponses = async () => {
            const data = await getAnnotationResponses(selectedAnnotation.id_annotation);
            setResponses(data);
        };
        fetchResponses();
    }, [responseMode, editingResponseId]);

    useEffect(() => {
        if (selectedAnnotation) {
            setEditedAnnotation(selectedAnnotation.contenu);
        }
    }, [selectedAnnotation]);

    const handleEditAnnotation = async () => {
        try {
            await updateAnnotation(selectedAnnotation.id_annotation, editedAnnotation);
            setIsEditingAnnotation(false);

            // Create updated annotation object with all properties
            const updatedAnnotation = {
                ...selectedAnnotation,
                contenu: editedAnnotation
            };

            dispatch(updateAnnotationRedux(updatedAnnotation));
        } catch (error) {
            console.error('Error updating annotation:', error);
        }
    };

    const handleDeleteAnnotation = async () => {
        try {
            await removeAnnotation(selectedAnnotation.id_annotation);
            dispatch(setSelectedAnnotation(null));
        } catch (error) {
            console.error('Error deleting annotation:', error);
        }
    };

    const handleEditResponse = async (responseId) => {
        try {
            await updateAnnotationResponse(responseId, editedResponse);
            setEditingResponseId(null);
        } catch (error) {
            console.error('Error updating response:', error);
        }
    }

    const handleDeleteResponse = async (responseId) => {
        try {
            await removeAnnotationResponse(responseId);
            setResponses(responses.filter(response => response.id_reponse_annotation !== responseId));
        } catch (error) {
            console.error('Error deleting response:', error);
        }
    }

    const closeAnnotation = async (annotationId) => {
        try {
            await updateAnnotationState(annotationId, 'resolu');
        } catch (error) {
            console.error('Error deleting response:', error);
        }
        dispatch(setSelectedAnnotation(null));
    }

    return (
        <Draggable
            handle=".drag-handle"
            bounds="parent"
            defaultPosition={{ x: 20, y: 200 }}
            grid={[1, 1]}
            scale={1}
            defaultClassName="react-draggable"
        >
            <Box
                className="drag-handle"
                onClick={(e) => {
                    if (!isEditingAnnotation && editingResponseId === null) {
                        setResponseMode(true);
                    }
                }}
                ref={boxRef}
                sx={{
                    position: 'absolute', // Changed from fixed
                    zIndex: 2,
                    width: { sm: 200, md: 300, lg: 400 },
                    minHeight: 300,
                    maxHeight: '80vh',
                    backgroundColor: "#91b9ff",
                    borderRadius: 10,
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'background-color 0.2s ease', // Only transition background
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
                        backgroundColor: '#6da2ff'
                    }
                }}
            >
                {/* Add draggable handle */}
                <Box

                    sx={{
                        cursor: 'move',
                        padding: 2,
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Typography>Annotation</Typography>
                    <Box>
                        
                        {
                            <IconButton
                            onClick={() => {
                                closeAnnotation(selectedAnnotation.id_annotation);
                            }}
                            sx={{ color: 'rgba(0, 0, 0, 0.54)' }}
                        >
                            <CheckIcon />
                        </IconButton>
                        }
                        <IconButton
                            onClick={() => dispatch(setSelectedAnnotation(null))}
                            sx={{ color: 'rgba(0, 0, 0, 0.54)' }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Box sx={{
                    overflowY: 'auto',
                    flex: 1,
                    padding: 2
                }}>
                    <Box sx={{ display: "flex", alignSelf: "baseline", margin: 2 }}>
                        <Avatar sx={{ alignSelf: "baseline" }} />
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <Typography sx={{ marginLeft: 1 }} variant="h6" align="center">{`${selectedAnnotation.nom} ${selectedAnnotation.prenom}`}</Typography>
                            <Typography>
                                {selectedAnnotation.date ? formatDate(selectedAnnotation.date) : ''}
                            </Typography>
                        </Box>

                    </Box>
                    <Box
                        sx={{
                            marginLeft: 2,
                            marginRight: 2,
                            transition: 'background-color 0.2s ease',
                            backgroundColor: 'transparent',
                            borderRadius: 5,
                            cursor: 'pointer',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.05)'
                            }
                        }}
                    >
                        {isEditingAnnotation ? (
                            <Box sx={{ margin: 2, display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <TextField
                                    label="Réponse"
                                    multiline
                                    value={editedAnnotation}
                                    onChange={(e) => setEditedAnnotation(e.target.value)}
                                    sx={{
                                        width: "90%",
                                        alignSelf: "center",
                                        borderRadius: "50px",
                                        color: '#f5f5f5',
                                        fontSize: "x-large",
                                        '& .MuiOutlinedInput-root': {
                                            borderColor: '#f5f5f5',
                                            borderRadius: "50px",
                                        },
                                    }}
                                    variant="outlined"
                                    fullWidth
                                />
                                <Button
                                    onClick={() => handleEditAnnotation()}
                                    variant="contained"
                                    sx={{ marginTop: 2, width: '20%', alignSelf: 'flex-end' }}
                                >
                                    Envoyer
                                </Button>
                            </Box>
                        ) : (
                            <>
                                <Typography sx={{ padding: 1, flexGrow: 1 }}>{selectedAnnotation.contenu}</Typography>
                                <Box sx={{ display: 'flex', gap: 1, marginRight: 1 }}>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsEditingAnnotation(true);
                                        }}
                                        sx={{ '&:hover': { color: 'primary.main' } }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteAnnotation(selectedAnnotation.id_annotation);
                                        }}
                                        sx={{ '&:hover': { color: 'error.main' } }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </>
                        )}
                    </Box>
                    {responses.length > 0 && responses.map((response, index) => (
                        <Box key={response.id_reponse || index}>
                            <Box sx={{ display: "flex", alignSelf: "baseline", margin: 2 }}>
                                <Avatar sx={{ alignSelf: "baseline" }} />
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                    <Typography sx={{ marginLeft: 1 }} variant="h6" align="center">
                                        {`${response.nom} ${response.prenom}`}
                                    </Typography>
                                    <Typography>
                                        {formatDate(response.date)}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    marginLeft: 2,
                                    marginRight: 2,
                                    transition: 'background-color 0.2s ease',
                                    backgroundColor: 'transparent',
                                    borderRadius: 5,
                                    cursor: 'pointer',
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.05)'
                                    }
                                }}
                            >
                                {editingResponseId === response.id_reponse_annotation ? (
                                    <Box sx={{ margin: 2, display: 'flex', flexDirection: 'column', width: '100%' }}>
                                        <TextField
                                            label="Réponse"
                                            multiline
                                            value={editedResponse}
                                            onChange={(e) => setEditedResponse(e.target.value)}
                                            sx={{
                                                width: "90%",
                                                alignSelf: "center",
                                                borderRadius: "50px",
                                                color: '#f5f5f5',
                                                fontSize: "x-large",
                                                '& .MuiOutlinedInput-root': {
                                                    borderColor: '#f5f5f5',
                                                    borderRadius: "50px",
                                                },
                                            }}
                                            variant="outlined"
                                            fullWidth
                                        />
                                        <Button
                                            onClick={() => {
                                                handleEditResponse(response.id_reponse_annotation);

                                            }}
                                            variant="contained"
                                            sx={{ marginTop: 2, width: '20%', alignSelf: 'flex-end' }}
                                        >
                                            Envoyer
                                        </Button>
                                    </Box>
                                ) : (
                                    <>
                                        <Typography sx={{ padding: 1 }}>{response.contenu}</Typography>
                                        <Box sx={{ display: 'flex', gap: 1, marginRight: 1 }}>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingResponseId(response.id_reponse_annotation);
                                                    setEditedResponse(response.contenu);
                                                }}
                                                sx={{ '&:hover': { color: 'primary.main' } }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteResponse(response.id_reponse_annotation);
                                                }}
                                                sx={{ '&:hover': { color: 'error.main' } }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </>
                                )}
                            </Box>
                        </Box>
                    ))}
                    {responseMode && (
                        <Box sx={{ margin: 2, display: 'flex', flexDirection: 'column' }}>
                            <TextField
                                label="Réponse"
                                multiline
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                sx={{
                                    width: "90%",
                                    alignSelf: "center",
                                    borderRadius: "50px",
                                    color: '#f5f5f5',
                                    fontSize: "x-large",
                                    '& .MuiOutlinedInput-root': {
                                        borderColor: '#f5f5f5',
                                        borderRadius: "50px",
                                    },

                                }}
                                variant="outlined"
                                fullWidth
                            />
                            <Button onClick={handleAddAnswer} variant="contained" sx={{ marginTop: 2, width: '20%', alignSelf: 'flex-end' }}>Envoyer</Button>
                        </Box>
                    )}
                </Box>
            </Box>
        </Draggable>
    );
}

export default Annotation;