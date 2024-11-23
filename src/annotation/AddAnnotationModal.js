import React, { useEffect, useState } from 'react';
import { Modal, Box, TextField, Avatar, Typography } from '@mui/material';
import StyledButton from '../composent/StyledBouton';
import { getUserInfo } from '../API/ProfileAPI';
import { createAnnotationCours, createAnnotationQuiz } from '../API/AnnotationAPI';

const AddAnnotationModal = ({ open, handleClose, resourceId, parentType }) => {

    const [annotation, setAnnotation] = useState('');
    const [user, setUser] = useState('');

    const handleChange = (event) => {
        setAnnotation(event.target.value);
    };

    const handleCancel = () => {
        setAnnotation('');
        handleClose();
    };

    const handleCreateAnnotation = async () => {
        if (parentType === 'Study') {
            await createAnnotationCours(resourceId, annotation);
        } else if (parentType === 'AnnotationQuiz') {
            await createAnnotationQuiz(parseInt(resourceId), annotation);
        }
        setAnnotation('');
        handleClose();
    };


    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const user = await getUserInfo();
                setUser(user);
            } catch (error) {
                console.error('Erreur lors de la récupération des informations utilisateurs:', error);
            }
        };
        fetchUserInfo();
    }, []);



    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    borderRadius: 10,
                    boxShadow: 24,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Box sx={{display: "flex", alignSelf: "baseline", marginBottom: 2 }}>
                    <Avatar alt={`${user.nom} ${user.prenom}`} src={user.url} sx={{ alignSelf: "baseline"}} />
                    <Typography sx={{marginLeft: 1}} variant="h6" align="center">{`${user.nom} ${user.prenom}`}</Typography>
                </Box>
                <TextField
                    label="Annotation"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={6}
                    value={annotation}
                    onChange={handleChange}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <StyledButton content={'Annuler'} width={250} color={'background.paper'} onClick={handleCancel} />
                    <StyledButton content={'Enregistrer'} width={250} color={"secondary"} onClick={handleCreateAnnotation} />
                </Box>
            </Box>
        </Modal>
    );
};

export default AddAnnotationModal;