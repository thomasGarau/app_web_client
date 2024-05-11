import React, { useState } from 'react';
import { Link, Box, Typography, Popover } from '@mui/material';
import StyledButton from '../composent/StyledBouton';
import { createCookie } from '../services/Cookie';
import { useNavigate } from 'react-router-dom';
import { Authenticate, updatePassword } from './UserAPI';

function Reset() {

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [numEtudiant, setNumEtudiant] = useState('');
  const [code, setCode] = useState('');
  const [errorAnchorEl, setErrorAnchorEl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [id, setId] = useState(undefined);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();


  const handleReset = async (e) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{12,})/;
    if (!passwordRegex.test(password)) {
      setErrorMessage('Le mot de passe doit contenir au moins une majuscule, un caractère spécial et faire 12 caractères ou plus.');
      setErrorAnchorEl(document.getElementById('password'));
      setId('error-popover');
      setOpen(true);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Mot de passe différent! Veuillez réessayer.');
      setErrorAnchorEl(document.getElementById('confirmPassword'));
      setId('error-popover');
      setOpen(true);
      console.error("Les mots de passe ne correspondent pas.");
      return;
    }
    try {
      await updatePassword(numEtudiant,code, password)
      const data = await Authenticate(numEtudiant, password);
      const { token, days, role } = data;
      if (token) {
        createCookie(token, days, role);
        navigate('/home');
      } else {
      }
    } catch (error) {
      console.error('Erreur lors de la modification du mot de passe :', error);
      setErrorMessage('Erreur lors de la modification du mot de passe');
      setErrorAnchorEl(document.getElementById('password'));
      setId('error-popover');
      setOpen(true);
    }

  };

  const handleClosePopover = () => {
    setErrorAnchorEl(null);
    setErrorMessage('');
    setOpen(false);
  };

  return (
    <div className='background'>
      <div className='base-container'>
        <Typography sx={{ fontSize: { xs: "2em", sm: "3em", md: "4em" }, margin: "0px" }}>Reinitialiser le mot de passe</Typography>
        <div className='sub-container'>
          <input
            className='input-connexion'
            type="text"
            id="numEtudiant"
            name="numEtudiant"
            placeholder='N° étudiant'
            required
            value={numEtudiant}
            onChange={(e) => setNumEtudiant(e.target.value)}
          />
          <input
            className='input-connexion'
            type="text"
            id="code"
            name="code"
            placeholder='Le code reçu par mail'
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <input
            className='input-connexion'
            type="password"
            id="password"
            name="password"
            placeholder='Votre nouveau mot de passe'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className='input-connexion'
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder='Confirmer votre nouveau mot de passe'
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <StyledButton
          color={"primary"}
          content={"Valider"}
          onClick={handleReset}>Valider
        </StyledButton>
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
  )
} export default Reset;