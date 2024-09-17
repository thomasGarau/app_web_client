import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './principal.css';
import "@fontsource/nanum-pen-script";
import { Box, Button, Modal, Typography } from "@mui/material";
import StyledButton from '../composent/StyledBouton.js';
import GenConModal from '../composent/GenConModal.js';

const style = {
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: '70%', md: '50%' },
  bgcolor: 'background.paper',
  border: '2px solid #133D56',
  boxShadow: 24,
  borderRadius: 2,
  Typography: 4,
  height: '90vh',
};



function Accueil() {
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
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
        <div className='title_container'>
          <Typography sx={{
            marginTop: "20px", fontSize: {
              xs: "1em",
              sm: "1.5em",
              md: "2em"
            },
            fontWeight: "bold"
          }}>Bienvenue sur TrackMates!</Typography>
          <Typography sx={{
            margin: "0px", fontSize: {
              xs: "0.8em",
              sm: "1.3em",
              md: "1.7em"
            },
            fontWeight: "bold"
          }} >La plateforme de quizz pour les étudiants de France</Typography>
          <Typography sx={{
            margin: "0px", fontSize: {
              xs: "0.8em",
              sm: "1.3em",
              md: "1.7em"
            },
            fontWeight: "bold"
          }} >Commencez par vous connecter ou vous inscrire</Typography>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: "1", justifyContent: "space-evenly" }}>
          <StyledButton color="primary" width="400px" content={"INSCRIPTION"} onClick={handleRegisterClick} />
          <StyledButton color="primary" width="400px" content={"CONNEXION"} onClick={handleConnexionClick} />
          <StyledButton color='primary' width='400px' content={"CONDITIONS GENERALES"} onClick={handleOpenModal}>Condition général d'utilisation?</StyledButton>
        </div>

        <GenConModal
          open={openModal}
          onClose={handleCloseModal}
          title="Conditions Générales d'Utilisation de TrackMates"
        />
      </div>
    </div>
  );
}

export default Accueil;