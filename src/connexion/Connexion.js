//dependances
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//modules
import { Authenticate, getUserInfo } from './UserAPI.js';
import { createCookie } from '../services/Cookie.js';
import { Link, Box, Popover, Typography } from '@mui/material';
import './Connexion.css';
import "@fontsource/nanum-pen-script";
import StyledButton from '../composent/StyledBouton.js';
import { decodeJWT } from '../services/decode.js';



function Connexion() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorAnchorEl, setErrorAnchorEl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [id, setId] = useState(undefined);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();


  //...
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await Authenticate(username, password);
      const { token, days} = data;
      if (token) {
        const tokenInfo = decodeJWT(token);
        createCookie(token, days, tokenInfo.role);
        if (tokenInfo.role === 'administration') {
          navigate('/admin-interface');
        } else {
          navigate('/home');
        }
      } else {
        console.log("Erreur de connexion");
      }
    } catch (error) {
      console.error('Erreur lors de l\'authentification :', error);
      if (!username.trim()) {
        setErrorMessage('Veuillez remplir tous les champs.');
        setErrorAnchorEl(document.getElementById('username'));
      } else if (!password.trim()) {
        setErrorMessage('Veuillez remplir tous les champs.');
        setErrorAnchorEl(document.getElementById('password'));
        console.log(document.getElementById('password'));
      } else {
        setErrorMessage('Mot de passe invalide! Veuillez réessayer.');
        setErrorAnchorEl(document.getElementById('password'));
        console.log(document.getElementById('password'));

      }
      setId('error-popover');
      setOpen(true);
    };
  };


  const handleClosePopover = () => {
    setErrorAnchorEl(null);
    setErrorMessage('');
    setOpen(false);
  };

  const toRegister = async (e) => {
    e.preventDefault();
    navigate('/register');
  };

  return (
    <div className='background'>
      <div className='base-container'>
        <Typography sx={{ fontSize: { xs: "2em", sm: "3em", md: "4em" }, margin: "0px" }}>Connexion</Typography>
        <div className='sub-container'>
          <input
            aria-describedby={id}
            className='input-connexion'
            type="text"
            id="username"
            name="username"
            placeholder="N° Etudiant"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            aria-describedby={id}
            className='input-connexion'
            type="password"
            id="password"
            name="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link sx={{ fontSize: { xs: "1em", sm: "1.5em", md: "2em" } }} color="#f5f5f5" href="/forgot_password" underline='always'>Mot de passe oublié?</Link>
        </div>
        <div className='buttons-container'>
          <StyledButton
            color={"secondary"}
            onClick={toRegister}
            content={"Inscription"}>
          </StyledButton>
          <StyledButton
            color={"primary"}
            content={"Valider"}
            onClick={handleLogin}
          >
            Valider
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
} export default Connexion;
