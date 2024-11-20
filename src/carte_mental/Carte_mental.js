import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './Carte_mentale.css';
import { Pagination } from '@mui/material';
import StyledButton from '../composent/StyledBouton';

function Carte_mental() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cartes, setCartes] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 2;

  function handleCreateCmClick() {
    navigate(`/creer_carte_mentale/${id}`);
  }

  // Gestion de la pagination
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Pagination des cartes mentales
  const paginatedCartes = cartes.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  useEffect(() => {
    // Charger le fichier JSON local
    fetch(`${process.env.PUBLIC_URL}/mindmap.json`)
      .then((response) => response.json())
      .then((data) => setCartes(data))
      .catch((error) => console.error("Erreur lors du chargement des cartes mentales :", error));
  }, []);

  // Gestion du clic sur une carte mentale
  const handleCardClick = (carteId) => {
    navigate(`/voir_carte_mentale/${carteId}`);
  };

  return (
    <div className='container-carte-mentale'>
      <div className='titre-carte-mentale'>
        <h1>Carte Mentale du chapitre n°{id}</h1>
      </div>
      <div className='container-grey-carte-mentale'>
        <div className='container-left-carte-mentale'>
          <h3>Vos cartes mentales</h3>
          <div className='container-element-carte-mentale'>
            {paginatedCartes.map((carte) => (
              <div
                key={carte.id_carte_mentale}
                className='element-carte-mentale'
                onClick={() => handleCardClick(carte.id_carte_mentale)} // Redirection au clic
                style={{ cursor: 'pointer' }} // Indicateur visuel pour le clic
              >
                <p>{carte.details.title}</p>
                <img
                  src={`${process.env.PUBLIC_URL}/cartementale.png`}
                  alt="Carte mentale"
                />
              </div>
            ))}
          </div>
          <Pagination
            count={Math.ceil(cartes.length / itemsPerPage)}
            page={page}
            onChange={handleChangePage}
            shape="rounded"
          />
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
