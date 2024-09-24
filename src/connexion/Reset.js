import React, { useState } from 'react';
import { Link, Box, Typography, Popover } from '@mui/material';
import StyledButton from '../composent/StyledBouton';
import { createCookie } from '../services/Cookie';
import { useNavigate } from 'react-router-dom';
import { Authenticate, updatePassword } from '../API/UserAPI';
import PageContainer from './connexion_component/PageContainer';
import AuthForm from './connexion_component/AuthForm';
import PopoverError from '../composent/PopoverError';
import useErrorPopover from '../composent/useErrorPopover';
import { passwordRegex } from '../services/Regex.js';


function Reset() {

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [numEtudiant, setNumEtudiant] = useState('');
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const { errorMessage, errorAnchorEl, id, openAnchor, showErrorPopover, handleClosePopover } = useErrorPopover();

  const inputs = [
    { type: "text", id: "numEtudiant", name: "numEtudiant", placeholder: "N° étudiant", value: numEtudiant, required: true },
    { type: "text", id: "code", name: "code", placeholder: "Le code reçu par mail", value: code, required: true },
    { type: "password", id: "password", name: "password", placeholder: "Votre nouveau mot de passe", value: password, required: true },
    { type: "password", id: "confirmPassword", name: "confirmPassword", placeholder: "Confirmer votre nouveau mot de passe", value: confirmPassword, required: true }
  ];
  const values = { numEtudiant, code, password, confirmPassword };
  
  const setValues = (newValues) => {
    setNumEtudiant(newValues.numEtudiant);
    setCode(newValues.code);
    setPassword(newValues.password);
    setConfirmPassword(newValues.confirmPassword);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!passwordRegex.test(password)) {
      showErrorPopover('Le mot de passe doit contenir au moins une majuscule, un caractère spécial et faire 12 caractères ou plus.', 'password');
      return;
    }
    if (password !== confirmPassword) {
      showErrorPopover('Mot de passe différent! Veuillez réessayer.', 'confirmPassword');
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
      showErrorPopover(('Erreur lors de la modification du mot de passe :', error), 'password');
    }

  };

  return (
    <PageContainer title="Réinitialiser le mot de passe">
      <AuthForm inputs={inputs} values={values} setValues={setValues} />
      <StyledButton color={"primary"} onClick={handleReset} content={"Valider"} />
      <PopoverError id={id} open={openAnchor} anchorEl={errorAnchorEl} onClose={handleClosePopover} errorMessage={errorMessage} />
    </PageContainer>
  )
} export default Reset;