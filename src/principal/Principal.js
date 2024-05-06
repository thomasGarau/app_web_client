import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './principal.css';
import "@fontsource/nanum-pen-script";
import { Box, Button, Modal, Typography } from "@mui/material";
import StyledButton from '../composent/StyledBouton.js';

function Accueil() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
          <h1 className='title_style'>Bienvenue sur TrackMates!</h1>
          <h2 style={{ margin: "0px" }} className='subtitle_style'>La plateforme de quizz pour les étudiants de France</h2>
          <h2 style={{ margin: "0px" }} className='subtitle_style'>Commencez par vous connecter ou vous inscrire</h2>
        </div>
        <StyledButton color="primary" width="400px" content={"INSCRIPTION"} onClick={handleRegisterClick} />
        <StyledButton color="primary" width="400px" content={"CONNEXION"} onClick={handleConnexionClick} />
        <StyledButton color='primary' width='400px' content={"CONDITIONS GENERALES"} onClick={handleOpen}>Condition général d'utilisation?</StyledButton>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Il y aura ici les conditions générales d'utilisation...
            </Typography>

          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default Accueil;