import React from 'react';
import { useNavigate } from 'react-router-dom';

function Accueil() {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleConnexionClick = () => {
    navigate('/connexion');
  };

  return (
    <div>
      <h1>Page d'accueil</h1>
      <p>Bienvenue sur la page d'accueil de mon application.</p>
      <button onClick={handleRegisterClick}>Inscription</button>
      <button onClick={handleConnexionClick}>Connexion</button>
    </div>
  );
}

export default Accueil;