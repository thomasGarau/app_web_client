import React, { useState } from 'react';
import { Link, Box, Typography } from '@mui/material';
import StyledButton from '../composent/StyledBouton';
import { Retrieve } from './UserAPI';
import { useNavigate } from 'react-router-dom';

function Forgot() {
  const [numEtudiant, setNumEtudiant] = useState('');
  const navigate = useNavigate();


  const handleValidate = async () => {
    try {
      console.log("numEtudiant", numEtudiant);
      const responseData = await Retrieve(numEtudiant);
      // Vérifier si la réponse contient la propriété 'token'
      if (responseData && responseData.token) {
        navigate('/reset_password');
      } else {
        console.error('Token introuvable dans la réponse de la récupération du mot de passe');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du mot de passe :', error);
    }
  };

  const handleChange = (e) => {
    console.log(e.target.value);
    const { value } = e.target;
    setNumEtudiant(e.target.value);
  }


  return (
    <div className='background'>
      <div className='base-container'>
        <Typography sx={{ fontSize: { xs: "2em", sm: "3em", md: "4em" }, margin: "0px" }}>Mot de passe oublie</Typography>
        <div className='sub-container'>
          <input
            className='input-connexion'
            type="text"
            id="numEtudiant"
            name="numEtudiant"
            placeholder="n° étudiant"
            value={numEtudiant}
            onChange={handleChange}
          />
        </div>
        <StyledButton
          color={"primary"}
          content={"Valider"}
          onClick={handleValidate}>Valider
        </StyledButton>

      </div>

    </div>
  )
} export default Forgot;