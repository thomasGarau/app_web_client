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
        <div style={{display: "flex", flexDirection:"column", flex: "1", justifyContent:"space-evenly"}}>
          <StyledButton color="primary" width="400px" content={"INSCRIPTION"} onClick={handleRegisterClick} />
          <StyledButton color="primary" width="400px" content={"CONNEXION"} onClick={handleConnexionClick} />
          <StyledButton color='primary' width='400px' content={"CONDITIONS GENERALES"} onClick={handleOpen}>Condition général d'utilisation?</StyledButton>
        </div>

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