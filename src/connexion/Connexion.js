//dependances
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//modules
import { Authenticate } from './UserAPI.js';
import { createCookie } from '../services/Cookie.js';
import {Link, Box} from '@mui/material';
import './Connexion.css';
import "@fontsource/nanum-pen-script";
import Header from '../composent/Header.js';
import StyledButton from '../composent/StyledBouton.js';



function Connexion() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    await Authenticate(username, password)
      .then(data => {
        const { username, token, days, role } = data;
        if (token) {
          createCookie(token, days, role);
          navigate('/home');
        } else {
          console.log("Erreur de connexion");
        }
      })
      .catch(error => {
        console.error('Erreur lors de l\'authentification :', error);
      });

  };

  const toRegister = async (e) => {
    e.preventDefault();
    navigate('/register');
  };

  return (
    <div className='background'>
      <div className='base-container'>
        <h1 style={{ fontSize: "4em", margin: "0px" }}>Connexion</h1>
        <div className='sub-container'>
          <input
            className='input-connexion'
            type="text"
            id="username"
            name="username"
            placeholder="N° Etudiant"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className='input-connexion'
            type="password"
            id="password"
            name="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link style={{fontSize:"2em"}} color="#f5f5f5" href="/forgot_password" underline='always'>Mot de passe oublie?</Link>
        </div>
        <div className='buttons-container'>
          <StyledButton
            color={"secondary"}
            content={"Inscription"}
            onClick={toRegister}>Inscription</StyledButton>
          <StyledButton
            color={"primary"}
            content={"Valider"}
            onClick={handleLogin}>Valider
          </StyledButton>
        </div>

      </div>

    </div>
  );
} export default Connexion;
