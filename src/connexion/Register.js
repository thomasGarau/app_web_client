import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "@fontsource/nanum-pen-script";
import { Registry } from '../API/UserAPI.js';
import { createCookie } from '../services/Cookie.js';
import './Connexion.css';
import StyledButton from '../composent/StyledBouton.js';
import { Box, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import GenConModal from '../composent/GenConModal.js';
import PageContainer from './connexion_component/PageContainer.js';
import AuthForm from './connexion_component/AuthForm.js';
import PopoverError from '../composent/PopoverError.js';
import useErrorPopover from '../composent/useErrorPopover.js';
import { emailRegex, passwordRegex } from '../services/Regex.js';


function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [checkedGeneral, setCheckedGeneral] = useState(false);
    const [checkedTracking, setCheckedTracking] = useState(false);
    const handleCloseModal = () => setOpenModal(false);
    const inputs = [
        { type: "email", id: "email", name: "email", placeholder: "email...", value: email, required: true },
        { type: "password", id: "password", name: "password", placeholder: "password...", value: password, required: true },
        { type: "password", id: "confirmPassword", name: "confirmPassword", placeholder: "Confirm password...", value: confirmPassword, required: true }
    ];

    const values = { email, password, confirmPassword };
    const setValues = (newValues) => {
        setEmail(newValues.email);
        setPassword(newValues.password);
        setConfirmPassword(newValues.confirmPassword);
    };
    const { errorMessage, errorAnchorEl, id, openAnchor, showErrorPopover, handleClosePopover } = useErrorPopover();
    const navigate = useNavigate();

    const handleOpenModal = () => {
        if (!emailRegex.test(email)) {
            showErrorPopover('Veuillez saisir une adresse e-mail valide.', 'email');
            return;
        }
        if (password !== confirmPassword) {
            showErrorPopover('Mot de passe différent! Veuillez réessayer.', 'confirmPassword');
            console.error("Les mots de passe ne correspondent pas.");
            return;
        }
        if (!passwordRegex.test(password)) {
            showErrorPopover('Le mot de passe doit contenir au moins une majuscule, un caractère spécial et faire 12 caractères ou plus.', 'password');
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
                showErrorPopover(('Erreur lors de l\'inscription :', error), 'email');
            });
    };

    const toConnection = (e) => {
        e.preventDefault();
        navigate('/connexion');
    };

    return (
        <PageContainer title="Inscription">
            <AuthForm inputs={inputs} values={values} setValues={setValues} />
            <div className='buttons-container'>
                <StyledButton color={"secondary"} onClick={toConnection} content={"Connexion"} />
                <StyledButton color={"primary"} onClick={handleOpenModal} content={"Valider"} />
            </div>
            <PopoverError id={id} open={openAnchor} anchorEl={errorAnchorEl} onClose={handleClosePopover} errorMessage={errorMessage} />
            <GenConModal open={openModal} handleClose={handleCloseModal} title="Conditions Générales d'Utilisation">
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
        </PageContainer>
    );
}

export default Register;
