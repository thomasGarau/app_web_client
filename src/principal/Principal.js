import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './principal.css';
import "@fontsource/nanum-pen-script";
import Header from '../composent/Header.js';
import { Button } from "@mui/material";
import StyledButton from '../composent/StyledBouton.js';

function Accueil() {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleConnexionClick = () => {
    navigate('/connexion');
  };

  const handlePresentationClick = () => {

  }

  return (
    <div className='style_background'>
      <div className='container1_style'>
        <StyledButton color="primary" width="400px" content={"PRESENTATION"} onClick={handlePresentationClick}/>
        <StyledButton color="primary" width="400px" content={"INSCRIPTION"} onClick={handleRegisterClick}/>
        <StyledButton color="primary" width="400px" content={"CONNEXION"} onClick={handleConnexionClick}/>
      </div>
    </div>
  );
}

export default Accueil;