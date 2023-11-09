import React from 'react';
import { Link } from 'react-router-dom';

function ListeUE() {
  // Exemple de données d'unités d'enseignement (à remplacer par vos propres données)
  const listeUE = [
    { id: 1, nom: 'UE1', description: 'Description de l\'UE1' },
    { id: 2, nom: 'UE2', description: 'Description de l\'UE2' },
    { id: 3, nom: 'UE3', description: 'Description de l\'UE3' },
  ];

  return (
    <div>
      <h1>Liste des Unités d'Enseignement (UE)</h1>
      <ul>
        {listeUE.map(ue => (
          <li key={ue.id}>
            <Link to={`/carte_mental`}>
              <strong>{ue.nom}</strong>: {ue.description}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListeUE;
