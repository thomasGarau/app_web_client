import React from 'react';
import { useNavigate } from 'react-router-dom';
import './principal.css';
import "@fontsource/nanum-pen-script";
import Header from '../composent/Header.js';

function Accueil() {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleConnexionClick = () => {
    navigate('/connexion');
  };

  return (
    <div className='style_background'>
      <Header></Header>
      <div className='container1_style'>
        <button className='button1' onClick={handleRegisterClick}>Inscription</button><br></br>
        <button className='button2' onClick={handleConnexionClick}>Connexion</button>
      </div>
    </div>
  );
}

export default Accueil;