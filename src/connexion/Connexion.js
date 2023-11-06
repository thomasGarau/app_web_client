// Accueil.js
import React from 'react';
import { useNavigate } from 'react-router-dom';


function Connexion() {
  const navigate = useNavigate();

  const handleNavigation = () => {
    // Utilisez la fonction de navigation pour aller à la page "À Propos"
    navigate('/connexion');
  };
  return (
    <div>
      <h1>Page d'accueil</h1>
      <p>Bienvenue sur la page d'accueil de mon application.</p>
 
    </div>
  );
}

export default Connexion;
