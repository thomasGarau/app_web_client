import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "@fontsource/nanum-pen-script";
import { Registry } from './UserAPI.js';
import { createCookie } from '../services/Cookie.js';
import './Connexion.css';
import StyledButton from '../composent/StyledBouton.js';
import { Popover, Typography } from '@mui/material';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorAnchorEl, setErrorAnchorEl] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [id, setId] = useState(undefined);
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
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

        await Registry(email, password)
            .then(data => {
                const { token, days } = data;
                if (token) {
                    createCookie(token, days);
                    navigate('/home');
                } else {
                    console.log("Erreur lors de l'inscription");
                }
            })
            .catch(error => {
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
                <Typography sx={{ fontSize: {xs: "2em", sm: "3em", md:"4em"}, margin: "0px" }}>Inscription</Typography>
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
                        onClick={handleRegister}>
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
            </div>
        </div>
    );
}

export default Register;
