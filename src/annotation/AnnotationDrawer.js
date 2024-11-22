import React, { useEffect, useState } from 'react';
import { Drawer, Button, Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getAnnotationsCours } from '../API/AnnotationAPI';

const AnnotationDrawer = ({ open, drawerClose, addAnnotation, setSelectedAnnotation, resourceId }) => {
    
    const [annotations, setAnnotations] = useState([]);

    useEffect(() => {
        fetchAnnotations();
    }, [open]);

    const fetchAnnotations = async () => {
        try {
            const data = await getAnnotationsCours(resourceId);
            setAnnotations(data);
        }
        catch (error) {
            console.error('Erreur lors de la récupération des annotations:', error);
        }
    }

    const changeAnnotation = (selectedAnnotation) => {
        setAnnotations(prevAnnotations => {
            return prevAnnotations.map(annotation => {
                if (annotation.id_annotation === selectedAnnotation.id_annotation) {
                    setSelectedAnnotation(selectedAnnotation);
                }
                setSelectedAnnotation(annotation);
            });
        });
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
            onClose={drawerClose}
        >
            <div style={{ backgroundColor: "#133D56" }}>
                {annotations.map((annotation, index) => (
                    <Button
                        key={annotation.id_annotation || index}
                        style={{
                            borderBottom: "solid",
                            borderRadius: "0px",
                            height: "73px",
                            color: "#f5f5f5",
                            transition: "0.2s",
                            width: "100%"
                        }}
                        className="button-annotation"
                        variant="plain"
                        onClick={() => { changeAnnotation(annotation); }}
                    >
                        <span style={{
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "100%",
                            textAlign: "left",
                            paddingLeft: "10px",
                            fontSize: "x-large",
                            overflow: "hidden",
                        }}>
                            {annotation.contenu === '' ? "Cliquer ici" : annotation.contenu}
                        </span>
                    </Button>
                ))}
                <Box style={{ margin: "10px 5px", display: "flex", alignItems: "center" }}>
                <IconButton className="icon-add" style={{ transition: "0.2s" }} onClick={() => addAnnotation(resourceId)}>
                        <AddIcon style={{ fill: "#F5F5F5" }} />
                    </IconButton>
                    <Typography style={{ color: "#F5F5F5", fontSize: "x-large" }}>
                        ajouter une annotation
                    </Typography>
                </Box>
            </div>
        </Drawer>
    );
};

export default AnnotationDrawer;
