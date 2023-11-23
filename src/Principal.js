// Accueil.js
import React from 'react';
import { useNavigate } from 'react-router-dom';


function Accueil() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };
  return (
    <div>
      <h1>Page d'accueil</h1>
      <p>Bienvenue sur la page d'accueil de mon application.</p>
      <button onClick={handleNavigation('/connexion')}>Inscription</button>
      <button onClick={handleNavigation('/register')}>Connexion</button>

    </div>
  );
}

export default Accueil;
