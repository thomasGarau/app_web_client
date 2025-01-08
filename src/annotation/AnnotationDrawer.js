import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Drawer, Button, Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getAnnotationsCours, getAnnotationsQuiz } from '../API/AnnotationAPI';
import { setAnnotations, setError, setLoading, setSelectedAnnotation } from '../Slice/annotationSlice';
import { se } from 'date-fns/locale';


const AnnotationDrawer = ({ open, onClose, addAnnotation, resourceId, parentType }) => {
    const dispatch = useDispatch();
    const annotations = useSelector(state => state.annotation.annotations);
    
    useEffect(() => {
        fetchAnnotations();
    }, [open]);

    const fetchAnnotations = async () => {
        try {
            dispatch(setLoading(true));
            let data;
            if (parentType === 'Study') {
                data = await getAnnotationsCours(resourceId);
            } else if (parentType === 'AnnotationQuiz') {
                data = await getAnnotationsQuiz(parseInt(resourceId));
            }
            dispatch(setAnnotations(data));
        }
        catch (error) {
            console.error('Erreur lors de la récupération des annotations:', error);
            dispatch(setError(error.message));
        }
        finally {
            dispatch(setLoading(false));
        }
    }

    const handleAnnotationClick = (annotation) => {
        dispatch(setSelectedAnnotation(null));
        dispatch(setSelectedAnnotation(annotation));
    };

    return (
        <Drawer
            PaperProps={{
                style: {
                    width: "250px",
                    backgroundColor: "#133D56",
                },
            }}
            open={open}
            onClose={onClose}
        >
            <Box >
                {annotations.map((annotation, index) => (
                    <Box 
                        key={annotation.id_annotation || index}
                        onClick={() => { handleAnnotationClick(annotation); onClose(); }}
                        sx={{
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                            }
                        }}
                    >
                        <Button
                            style={{
                                borderBottom: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "0px",
                                height: "73px",
                                color: "#f5f5f5",
                                transition: "all 0.2s ease",
                                width: "100%",
                                justifyContent: "flex-start",
                                padding: "12px",
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                            className="button-annotation"
                            variant="text"
                        >
                            <Typography sx={{
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                maxWidth: "100%",
                                textAlign: "left",
                            }}>
                                {annotation.contenu || "No content"}
                            </Typography>
                            <Typography sx={{textAlign: "right"}}>
                                {annotation.etat_annotation || "No state"}
                            </Typography>
                        </Button>
                    </Box>
                ))}
                <Box style={{ margin: "10px 5px", display: "flex", alignItems: "center" }}>
                <IconButton className="icon-add" style={{ transition: "0.2s" }} onClick={() => addAnnotation(resourceId)}>
                        <AddIcon style={{ fill: "#F5F5F5" }} />
                    </IconButton>
                    <Typography style={{ color: "#F5F5F5", fontSize: "x-large" }}>
                        ajouter une annotation
                    </Typography>
                </Box>
            </Box>
        </Drawer>
    );
};

export default AnnotationDrawer;
