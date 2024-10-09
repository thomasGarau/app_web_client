import React, { useState, useRef, useEffect } from 'react';
import StyledButton from '../composent/StyledBouton';
import { Box, Button, IconButton, Input, Modal, Snackbar, TextField, Typography } from '@mui/material';
import { addFormation, addUser } from '../API/AdminAPI';
import CloseIcon from '@mui/icons-material/Close';
import { logout } from '../API/UserAPI';
import { eraseCookie, getTokenAndRole } from '../services/Cookie';
import { useNavigate } from 'react-router-dom';


const style = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: '70%' },
    bgcolor: 'background.paper',
    border: '2px solid #133D56',
    boxShadow: 24,
    borderRadius: 2,
    Typography: 4,
    padding: { xs: '10px', sm: '20px', md: '40px' }
};

function AdminInterface() {
    const fileInputEleveRef = useRef(null);
    const fileInputFormationRef = useRef(null);
    const [fileTextEleve, setFileTextEleve] = useState('');
    const [fileEleve, setFileEleve] = useState('');
    const [fileTextFormation, setFileTextFormation] = useState('');
    const [fileFormation, setFileFormation] = useState('');
    const [isDragging, setIsDragging] = useState(false); // State pour contrôler l'effet visuel du glisser-déposer
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState('');
    const [buttonClicked, setButtonClicked] = useState('');
    const [openWarning, setOpenWarning] = useState(false);
    const [formationSent, setFormationSent] = useState(false);

    const navigate = useNavigate();

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true); // Activer l'effet visuel du glisser-déposer
    };

    const fileUploadEleve = (e) => {
        setFileTextEleve(e.target.files[0].name);
        setFileEleve(e.target.files[0]);
    };

    const fileUploadFormation = (e) => {
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

        setOpenSnackbar(false);
    };

    const openEleveWarning = () => {
        if (!formationSent) {
            setButtonClicked('eleve');
            setOpenWarning(true);
        }
        else {
            sendDataEleve();
        }
    };

    const handleCloseWarning = () => {
        setOpenWarning(false);
    };

    const sendData = async (file, apiCall, successMessage) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            await apiCall(formData);
            setMessage(successMessage);
            setOpenSnackbar(true);
            handleCloseWarning();
        } catch (error) {
            console.error('Erreur à l\'envoi de données', error);
        }
    }

    const sendDataEleve = () => sendData(fileEleve, addUser, 'Étudiants ajoutés avec succès');
    const sendDataFormation = () => {sendData(fileFormation, addFormation, 'Formation ajoutée avec succès'); setFormationSent(true)};

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
            const { token } = getTokenAndRole();
            await logout(token);
        } catch (error) {
            console.error('Erreur lors de la déconnexion :', error);
        } finally {
            eraseCookie();
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

            <Box sx={{
                position: 'absolute',
                bottom: { xs: '-25px', sm: '0px', md: '25%' },
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                flexDirection: { xs: 'column', md: 'row' }
            }}>
                <div><Typography>Liste d'élève à ajouter: </Typography>
                    <TextField
                        sx={{ height: { xs: '50px', sm: '62px', md: '75px' } }}
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
                    onClick={openEleveWarning}
                />
            </Box>
            <Box sx={{
                position: 'absolute',
                top: { xs: '260px', sm: '300px', md: '25%' },
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center', display: 'flex',
                alignItems: 'center',
                flexDirection: { xs: 'column', md: 'row' }
            }}>

                <div><Typography>Liste de formation, leurs UE et leurs professeurs: </Typography>
                    <TextField
                        sx={{ height: { xs: '50px', sm: '62px', md: '75px' } }}
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
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleClose}
                message={message}
                action={action}
            />
            <Modal
                open={openWarning}
                onClose={handleCloseWarning}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography sx={{
                        textAlign: 'center',
                        fontSize: { xs: '1em', sm: '1.5em', md: '2.5em' },
                    }}>ATTENTION!! Des formations doivent à tout prix apparaître dans votre base de donnée avant de mettre la liste des élèves, sans quoi l'envoi sera annulé.</Typography>

                    <Box sx={{ display: "flex" }}>
                        <StyledButton
                            width={300}
                            content={"D'accord"}
                            color={"secondary"}
                            onClick={handleCloseWarning} />

                    </Box>


                </Box>
            </Modal>
        </div>
    )
} export default AdminInterface;
