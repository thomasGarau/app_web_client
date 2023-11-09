import React from 'react';
import { useParams } from 'react-router-dom';
import MindMap from './MindMap';
function Carte_mental() {
  // Utilisez le hook useParams pour récupérer les paramètres d'URL
  const { id } = useParams();

  return (
    <div>
      <h1>Carte Mentale de l'UE {id}</h1>
      <MindMap />
      {/* Ajoutez ici le contenu de votre carte mentale en fonction de l'ID */}
    </div>
  );
}

export default Carte_mental;
