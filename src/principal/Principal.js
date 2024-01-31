import React from 'react';
import { useNavigate } from 'react-router-dom';
import './principal.css';
import "@fontsource/nanum-pen-script";

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
      <div className='container1_style'>
        <button className='button1' onClick={handleRegisterClick}>Inscription</button>
        <button onClick={handleConnexionClick}>Connexion</button>
      </div>
    </div>
  );
}

export default Accueil;