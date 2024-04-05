import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './principal.css';
import "@fontsource/nanum-pen-script";
import Header from '../composent/Header.js';
import { Button } from "@mui/material";

function Accueil() {
  const navigate = useNavigate();
  const [buttonPrincipaleStyle, setButtonPrincipaleStyle] = useState({
    width: "40%",
    fontFamily: "Nanum Pen Script",
    fontSize: "40px",
    height: "13%",
    borderRadius: "50px",
    backgroundColor: "#133D56",
    color: "#F5F5F5",

  })


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
      <Header></Header>
      <div className='container1_style'>
        <Button style={buttonPrincipaleStyle} variant='contained' onClick={handlePresentationClick}>Presentation</Button>
        <Button style={buttonPrincipaleStyle} variant='contained' onClick={handleRegisterClick}>Inscription</Button>
        <Button style={buttonPrincipaleStyle} variant='contained' onClick={handleConnexionClick}>Connexion</Button>
      </div>
    </div>
  );
}

export default Accueil;