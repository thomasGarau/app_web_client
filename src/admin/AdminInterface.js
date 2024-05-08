import React, { useState, useRef, useEffect } from 'react';
import StyledButton from '../composent/StyledBouton';
import { Box, Button, IconButton, Input, Snackbar, TextField, Typography } from '@mui/material';
import { addFormation, addUser } from './AdminAPI';
import CloseIcon from '@mui/icons-material/Close';
import { logout } from '../connexion/UserAPI';
import { eraseCookie, getTokenAndRole } from '../services/Cookie';
import { useNavigate } from 'react-router-dom';


function AdminInterface() {
    const fileInputEleveRef = useRef(null);
    const fileInputFormationRef = useRef(null);
    const [fileTextEleve, setFileTextEleve] = useState('');
    const [fileEleve, setFileEleve] = useState('');
    const [fileTextFormation, setFileTextFormation] = useState('');
    const [fileFormation, setFileFormation] = useState('');
    const [isDragging, setIsDragging] = useState(false); // State pour contrôler l'effet visuel du glisser-déposer
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true); // Activer l'effet visuel du glisser-déposer
    };

    const fileUploadEleve = (e) => {
        console.log(e.target.files[0]);
        setFileTextEleve(e.target.files[0].name);
        setFileEleve(e.target.files[0]);
    };

    const fileUploadFormation = (e) => {
        console.log(e.target.files[0]);
        setFileTextFormation(e.target.files[0].name);
        setFileFormation(e.target.files[0]);
    };

    const handleUploadEleve = (e) => {
        fileInputEleveRef.current.click();
    };

    const handleUploadFormation = (e) => {
        fileInputFormationRef.current.click();
    };

    const handleDrop = (e) => {
        setIsDragging(false);
        const file = e.dataTransfer.files[0];

        const reader = new FileReader();
        reader.onload = (event) => {
            const fileContent = event.target.result;
            if (fileContent.includes('formation')) {
                setFileTextFormation(file.name);
                setFileFormation(file);
            } else {
                console.log('Le fichier ne contient pas le mot "formation"');
                setFileTextEleve(file.name);
                setFileEleve(file);
            }
        };
        reader.readAsText(file);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false); // Désactiver l'effet visuel du glisser-déposer lorsque l'utilisateur quitte la zone de glisser-déposer
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const sendDataEleve = async () => {
        try {
            const formData = new FormData();
            console.log(fileEleve);
            formData.append('file', fileEleve);
            for (var key of formData.entries()) {
                console.log(key[0] + ', ' + key[1])
            }
            await addUser(formData);
            setMessage('Etudiants ajoutés avec succès');
            setOpen(true);
        } catch (error) {
            console.error('Erreur à l\'ajout de nouveaux étudiant', error);
        }
    }

    const sendDataFormation = async () => {
        try {
            const formData = new FormData();
            console.log(fileFormation);
            formData.append('file', fileFormation);
            for (var key of formData.entries()) {
                console.log(key[0] + ', ' + key[1])
            }
            await addFormation(formData);
            setMessage('Formation ajoutée avec succès');
            setOpen(true);
        } catch (error) {
            console.error('Erreur à l\'ajout de nouvelles formations', error);
        }
    }

    useEffect(() => {
        console.log(isDragging);
    }, [isDragging]);


    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
                UNDO
            </Button>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    async function handleDisconnection() {
        try {
            const { token, role } = getTokenAndRole();
            await logout(token)
            eraseCookie();
        } catch (error) {
            console.error('Erreur lors de la déconnexion :', error);
            throw error;
        } finally {
            navigate('/');
        }
    }

    return (
        <div style={{ backgroundColor: "#C3D9FF", height: '100%', position: 'relative' }} onDragOver={handleDragOver} onDrop={handleDrop} >
            {/* Afficher un message ou un effet visuel lorsque le glisser-déposer est en cours */}
            {isDragging && (
                <div onDragLeave={handleDragLeave} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}>
                    <Typography sx={{ fontSize: { xs: '1em', sm: '2em', md: '3em' }, color: 'white', textAlign: 'center', marginTop: '20%' }}>Déposez le fichier ici</Typography>
                </div>
            )}
            <Box sx={{ position: 'absolute', top: { xs: '240px', sm: '300px', md: '25%' }, left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', display: 'flex', alignItems: 'center', flexDirection: { xs: 'column', md: 'row' } }}>
                <div><Typography>Liste d'élève à ajouter: </Typography>
                    <TextField
                        disabled
                        variant="outlined"
                        type="text"
                        value={fileTextEleve}
                    /></div>

                <input
                    variant="outlined"
                    type="file"
                    ref={fileInputEleveRef}
                    style={{ display: 'none' }}
                    onChange={fileUploadEleve}
                />
                <StyledButton
                    content={"Choisir le fichier"}
                    color={"primary"}
                    onClick={handleUploadEleve}
                />
                <StyledButton
                    content={"Envoyer"}
                    color={"primary"}
                    onClick={sendDataEleve}
                />
            </Box>
            <Box sx={{ position: 'absolute', bottom: { xs: '-40px', sm: '0px', md: '25%' }, left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', display: 'flex', alignItems: 'center', flexDirection: { xs: 'column', md: 'row' } }}>

                <div><Typography>Liste de formation, leurs UE et leurs professeurs: </Typography>
                    <TextField
                        disabled
                        variant="outlined"
                        type="text"
                        value={fileTextFormation}
                    /></div>

                <input
                    variant="outlined"
                    type="file"
                    ref={fileInputFormationRef}
                    style={{ display: 'none' }}
                    onChange={fileUploadFormation}
                />
                <StyledButton
                    content={"Choisir le fichier"}
                    color={"primary"}
                    onClick={handleUploadFormation}
                />
                <StyledButton
                    content={"Envoyer"}
                    color={"primary"}
                    onClick={sendDataFormation}
                />
            </Box>
            <Box sx={{ position: 'absolute', bottom: { xs: '50px', md: '10%' }, left: '50%', transform: 'translate(-50%, 50%)', textAlign: 'center' }}>

                <StyledButton
                    content={"Deconnexion"}
                    color={"primary"}
                    onClick={handleDisconnection}
                />
            </Box>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message={message}
                action={action}
            />
        </div>
    )
} export default AdminInterface;