import React from 'react';
import { useParams , useNavigate} from 'react-router-dom';
import './Carte_mentale.css';
import { Pagination } from '@mui/material';
import StyledButton from '../composent/StyledBouton';





function Carte_mental() {
  
  const { id } = useParams();
  const navigate = useNavigate();

  function handleCreateCmClick() {
    navigate(`/creer_carte_mentale/${id}`);
  }

  return (
    <div className='container-carte-mentale'>
      <div className='titre-carte-mentale'>
        <h1>Carte Mentale du chapitre n°{id}</h1>
      </div>
      <div className='container-grey-carte-mentale'>
        <div className='container-left-carte-mentale'>
          <h3>Vos cartes mentales</h3>
          <div className='container-element-carte-mentale'>
            <div className='element-carte-mentale'>
              <img src={`${process.env.PUBLIC_URL}/cartementale.png`} alt="carte mentale" />
            </div>
            <Pagination count={10} shape="rounded" />
          </div>
        </div>
        <div className='verticalBarStyle'></div>
        <div className='container-right-carte-mentale'>
          <h3>Cartes mentales d'autres utilisateurs</h3>
          <div className='container-element-carte-mentale'>
            <div className='element-carte-mentale'>
              <img src={`${process.env.PUBLIC_URL}/cartementale.png`} alt="carte mentale" />
            </div>
            <Pagination count={10} shape="rounded" />
          </div>
        </div>
      </div>
      <StyledButton 
        content={"Créer une carte mentale"}
        color={"primary"}
        onClick={handleCreateCmClick}
       />
    </div>
  );
}

export default Carte_mental;
