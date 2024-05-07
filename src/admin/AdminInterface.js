import React, { useState, useRef, useEffect } from 'react';
import StyledButton from '../composent/StyledBouton';
import { Button, IconButton, Input, Snackbar, TextField, Typography } from '@mui/material';
import { addUser } from './AdminAPI';
import CloseIcon from '@mui/icons-material/Close';
import { logout } from '../connexion/UserAPI';
import { eraseCookie, getTokenAndRole } from '../services/Cookie';
import { useNavigate } from 'react-router-dom';


function AdminInterface() {
    const fileInputRef = useRef(null);
    const [fileText, setFileText] = useState('');
    const [file, setFile] = useState('');
    const [isDragging, setIsDragging] = useState(false); // State pour contrôler l'effet visuel du glisser-déposer
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true); // Activer l'effet visuel du glisser-déposer
    };

    const fileUpload = (e) => {
        console.log(e.target.files[0]);
        setFileText(e.target.files[0].name);
        setFile(e.target.files[0]);
    };

    const handleUpload = (e) => {
        fileInputRef.current.click();
    };

    const handleDrop = (e) => {
        console.log(e.dataTransfer.files[0]);
        setIsDragging(false);
        const files = e.dataTransfer.files[0];
        setFileText(files.name);
        setFile(files);

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

    const sendData = async () => {
        try {
            const formData = new FormData();
            console.log(file);
            formData.append('file', file);
            for (var key of formData.entries()) {
                console.log(key[0] + ', ' + key[1])
            }
            await addUser(formData);
            setOpen(true);
        } catch (error) {
            console.error('Erreur à l\'ajout de nouveaux étudiant', error);
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
            <div style={{ position: 'absolute', top: '300px', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', display: 'flex', alignItems: 'center' }}>

                <TextField
                    variant="outlined"
                    type="text"
                    value={fileText}
                />
                <input
                    variant="outlined"
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={fileUpload}
                />
                <StyledButton
                    content={"Choisir le fichier"}
                    color={"primary"}
                    onClick={handleUpload}
                />
            </div>
            <div style={{ position: 'absolute', bottom: '200px', left: '50%', transform: 'translate(-50%, 50%)', textAlign: 'center' }}>
                <StyledButton
                    content={"Envoyer"}
                    color={"primary"}
                    onClick={sendData}
                />
                <StyledButton
                    content={"Deconnexion"}
                    color={"primary"}
                    onClick={handleDisconnection}
                />
            </div>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message="Liste d'étudiants ajoutée avec succès!"
                action={action}
            />
        </div>
    )
} export default AdminInterface;