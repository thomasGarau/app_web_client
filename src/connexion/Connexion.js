//dependances
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//modules
import { Authenticate } from '../API/UserAPI.js';
import { createCookie } from '../services/Cookie.js';
import { Link } from '@mui/material';
import './Connexion.css';
import "@fontsource/nanum-pen-script";
import StyledButton from '../composent/StyledBouton.js';
import { decodeJWT } from '../services/decode.js';
import PageContainer from './connexion_component/PageContainer.js';
import AuthForm from './connexion_component/AuthForm.js';
import PopoverError from '../composent/PopoverError.js';
import useErrorPopover from '../composent/useErrorPopover.js';


function Connexion() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const inputs = [
    { type: "text", id: "username", name: "username", placeholder: "N° Etudiant", value: username },
    { type: "password", id: "password", name: "password", placeholder: "Mot de passe", value: password }
  ];
  const values = { username, password };
  const setValues = (newValues) => {
    setUsername(newValues.username);
    setPassword(newValues.password);
  };
  const { errorMessage, errorAnchorEl, id, openAnchor, showErrorPopover, handleClosePopover } = useErrorPopover();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await Authenticate(username, password);
      const { token, days } = data;
      if (token) {
        const tokenInfo = decodeJWT(token);
        createCookie(token, days, tokenInfo.role);
        navigate('/home');
      } else {
      }
    } catch (error) {
      console.error('Erreur lors de l\'authentification :', error);
      var message = '';
      var id = '';
      if (!username.trim()) {
        message = 'Veuillez remplir tous les champs.';
        id = 'username';
      } else if (!password.trim()) {
        message = 'Veuillez remplir tous les champs.';
        id = 'password';
      } else {
        message = 'Mot de passe invalide! Veuillez réessayer.';
        id = 'password';

      }
      showErrorPopover(message, id);
    };
  };

  const toRegister = async (e) => {
    e.preventDefault();
    navigate('/register');
  };

  return (
    <PageContainer title="Connexion">
      <AuthForm inputs={inputs} values={values} setValues={setValues} />
      <Link sx={{ fontSize: { xs: "1em", sm: "1.5em", md: "2em" }, color: "#000" }} href="/forgot_password" underline='always'>Mot de passe oublié?</Link>
      <div className='buttons-container'>
        <StyledButton color={"secondary"} onClick={toRegister} content={"Inscription"} />
        <StyledButton color={"primary"} onClick={handleLogin} content={"Valider"} />
      </div>
      <PopoverError id={id} open={open} anchorEl={errorAnchorEl} onClose={handleClosePopover} errorMessage={errorMessage} />
    </PageContainer>
  );
} export default Connexion;
