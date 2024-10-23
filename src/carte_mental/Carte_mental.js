import React from 'react';
import { useParams } from 'react-router-dom';
import './Carte_mentale.css';


function Carte_mental() {
  
  const { id } = useParams();

  return (
    <div className='container-carte-mentale'>
      <div className='titre-carte-mentale'>
        <h1>Carte Mentale de l'UE n°{id}</h1>
      </div>
      <div className='container-grey-carte-mentale'>
        <div className='container-left-carte-mentale'>
          <h3>Vos cartes mentales</h3>
          </div>
        <div className='verticalBarStyle'>

        </div>
      </div>
    </div>
  );
}

export default Carte_mental;
