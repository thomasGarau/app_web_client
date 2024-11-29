import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './Carte_mentale.css';
import { Pagination, Badge } from '@mui/material';
import StyledButton from '../composent/StyledBouton';
import { jwtDecode } from 'jwt-decode';
import { getTokenAndRole } from '../services/Cookie';
import BadgeCarteMentale from './composents/BadgeCarteMentale';
import { getCMUser, getAllCM } from "../API/CmAPI";

function Carte_mental() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cartes, setCartes] = useState([]);
  const [cartesAutresUtilisateurs, setCartesAutresUtilisateurs] = useState([]);
  const [page, setPage] = useState(1);
  const [pageAutres, setPageAutres] = useState(1); // Nouvelle pagination pour autres utilisateurs
  const itemsPerPage = 2;
  const [id_utilisateur, setId_utilisateur] = useState(undefined);

  function handleCreateCmClick() {
    navigate(`/creer_carte_mentale/${id}`);
  }

  async function fetchData(params) {
      const { token } = await getTokenAndRole();
      const decodedToken = jwtDecode(token);
      setId_utilisateur(decodedToken.id_etudiant);
  }

  // Gestion de la pagination
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleChangePageAutres = (event, value) => {
    setPageAutres(value);
  };

  // Pagination des cartes mentales
  const paginatedCartes = cartes.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const paginatedCartesAutres = cartesAutresUtilisateurs.slice(
    (pageAutres - 1) * itemsPerPage,
    pageAutres * itemsPerPage
  );

  useEffect(() => {
    fetchData();
    const data = getCMUser(id);
    data.then((res) => {
      setCartes(res);
    });

    const dataAutres = getAllCM(id);
    dataAutres.then((res) => {
      setCartesAutresUtilisateurs(res);
    });
  }, []);

  // Gestion du clic sur une carte mentale
  const handleCardClick = (carteId) => {
    navigate(`/voir_carte_mentale/${id}/${carteId}`);
  };

  return (
    <div className='container-carte-mentale'>
      <div className='titre-carte-mentale-home'>
        <h1>Carte Mentale du chapitre n°{id}</h1>
      </div>
      <div className='container-grey-carte-mentale'>
        <div className='container-left-carte-mentale'>
          <h3>Vos cartes mentales</h3>
          <div className='container-element-carte-mentale'>
          {paginatedCartes.map((carte) => ( 
            <div className='container-element-cm-badge' > 
           <BadgeCarteMentale isOtherUser={carte.id_utilisateur !== id_utilisateur} userName={carte.prenom + ' ' + carte.nom}>
                  <div
                    className='element-carte-mentale'
                    onClick={() => handleCardClick(carte.id_carte_mentale)}
                    style={{ cursor: 'pointer', position: 'relative' }}
                  >
                    <p>{carte.titre}</p>
                    <img
                      src={carte.url}
                      alt="Carte mentale"
                      style={{ borderRadius: '8px' }}
                    />
                  </div>
                </BadgeCarteMentale>

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
            {paginatedCartesAutres.map((carte) => (
              <div className='container-element-cm-badge' > 
                <BadgeCarteMentale isOtherUser={true} userName={carte.prenom + ' ' + carte.nom}>
                  <div
                    key={carte.id_carte_mentale}
                    className='element-carte-mentale'
                    onClick={() => handleCardClick(carte.id_carte_mentale)} // Redirection au clic
                    style={{ cursor: 'pointer' }}
                  >
                    <p>{carte.titre}</p>
                    <img
                      src={carte.url}
                      alt="Carte mentale"
                    />
                  </div>
                </BadgeCarteMentale>
              </div>

            ))}
          </div>
          <Pagination
            count={Math.ceil(cartesAutresUtilisateurs.length / itemsPerPage)}
            page={pageAutres}
            onChange={handleChangePageAutres}
            shape="rounded"
          />
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
