import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "@fontsource/nanum-pen-script";
import { Registry } from './UserAPI.js';
import { createCookie } from '../services/Cookie.js';
import './Connexion.css';
import StyledButton from '../composent/StyledBouton.js';
import { Box, Checkbox, FormControlLabel, FormGroup, Modal, Popover, Typography } from '@mui/material';
import GenConModal from '../composent/GenConModal.js';


const style = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: '70%', md: '50%' },
    bgcolor: 'background.paper',
    border: '2px solid #133D56',
    boxShadow: 24,
    borderRadius: 2,
    Typography: 4,
    height: '90vh',
};


function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorAnchorEl, setErrorAnchorEl] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [id, setId] = useState(undefined);
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [checkedGeneral, setCheckedGeneral] = useState(false);
    const [checkedTracking, setCheckedTracking] = useState(false);
    const handleCloseModal = () => setOpenModal(false);

    const navigate = useNavigate();

    const handleOpenModal = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage('Veuillez saisir une adresse e-mail valide.');
            setErrorAnchorEl(document.getElementById('email'));
            setId('error-popover');
            setOpen(true);
            return;
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{12,})/;
        if (password !== confirmPassword) {
            setErrorMessage('Mot de passe différent! Veuillez réessayer.');
            setErrorAnchorEl(document.getElementById('confirmPassword'));
            setId('error-popover');
            setOpen(true);
            console.error("Les mots de passe ne correspondent pas.");
            return;
        }
        if (!passwordRegex.test(password)) {
            setErrorMessage('Le mot de passe doit contenir au moins une majuscule, un caractère spécial et faire 12 caractères ou plus.');
            setErrorAnchorEl(document.getElementById('password'));
            setId('error-popover');
            setOpen(true);
            return;
        }
        setOpenModal(true);
    };

    const handleChangeGeneral = (event) => {
        setCheckedGeneral(event.target.checked);
    };

    const handleChangeTracking = (event) => {
        console.log(event.target.checked);
        setCheckedTracking(event.target.checked);
    };

    const handleRegister = async () => {
        const tracking = checkedTracking ? 1 : 0;
        await Registry(email, password, tracking)
            .then(data => {
                const { token, days } = data;
                if (token) {
                    createCookie(token, days);
                    navigate('/home');
                } else {
                }
            })
            .catch(error => {
                setOpenModal(false);
                console.error('Erreur lors de l\'inscription :', error);
                setErrorMessage('Vous n\'êtes pas autorisé à vous inscrire, ou un compte avec cet email existe déjà.');
                setErrorAnchorEl(document.getElementById('email'));
                setId('error-popover');
                setOpen(true);
            });
    };

    const handleClosePopover = () => {
        setErrorAnchorEl(null);
        setErrorMessage('');
        setOpen(false);
    };

    const toConnection = (e) => {
        e.preventDefault();
        navigate('/connexion');
    };

    return (
        <div className='background'>
            <div className='base-container'>
                <Typography sx={{ fontSize: { xs: "2em", sm: "3em", md: "4em" }, margin: "0px" }}>Inscription</Typography>
                <div className='sub-container'>
                    <input
                        aria-describedby='error-popover'
                        className='input-connexion'
                        type="email"
                        id="email"
                        name="email"
                        placeholder='email...'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        aria-describedby='error-popover'
                        className='input-connexion'
                        type="password"
                        id="password"
                        name="password"
                        placeholder='password..'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        aria-describedby='error-popover'
                        className='input-connexion'
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder='Confirm password..'
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div className='buttons-container'>
                    <StyledButton
                        color={"secondary"}
                        onClick={toConnection}
                        content={"Connexion"}>
                    </StyledButton>
                    <StyledButton
                        className='valid-button button-connection'
                        color={"primary"}
                        content={"Valider"}
                        onClick={handleOpenModal}>
                    </StyledButton>
                </div>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={errorAnchorEl}
                    onClose={handleClosePopover}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Typography sx={{ p: 2 }}>{errorMessage}</Typography>
                </Popover>
                <GenConModal
                    open={openModal}
                    handleClose={handleCloseModal}
                    title="Conditions Générales d'Utilisation de TrackMates"
                >

                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <FormGroup sx={{ paddingLeft: "20px" }}>
                            <FormControlLabel control={<Checkbox checked={checkedGeneral}
                                onChange={handleChangeGeneral} />} label="J'accepte les conditions générales d'utilisation" />
                            <FormControlLabel control={<Checkbox checked={checkedTracking}
                                onChange={handleChangeTracking} />} label="J'accepte que l'application enregistre des données pour un suivi personnalisé" />

                        </FormGroup>
                        <StyledButton
                            isDisabled={!checkedGeneral}
                            onClick={handleRegister}
                            width={300}
                            color={'primary'}
                            content={"Valider l'inscription"} />
                    </Box>

                </GenConModal>
            </div>
        </div >
    );
}

export default Register;
