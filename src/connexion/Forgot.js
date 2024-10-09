import React, { useState } from 'react';
import StyledButton from '../composent/StyledBouton';
import { Retrieve } from '../API/UserAPI';
import { useNavigate } from 'react-router-dom';
import PageContainer from './connexion_component/PageContainer';
import AuthForm from './connexion_component/AuthForm';
import useErrorPopover from '../composent/useErrorPopover.js';
import { contenuRegex } from '../services/Regex.js';


function Forgot() {
  const [numEtudiant, setNumEtudiant] = useState('');
  const navigate = useNavigate();
  const { errorMessage, errorAnchorEl, id, openAnchor, showErrorPopover, handleClosePopover } = useErrorPopover();
  const inputs = [
    { type: "text", id: "numEtudiant", name: "numEtudiant", placeholder: "n° étudiant", value: numEtudiant }
  ];

  const values = { numEtudiant };

  const setValues = (newValues) => {
    handleChange(newValues.numEtudiant);
  };

  const handleValidate = async () => {
    try {
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
    if(!contenuRegex.test(e.target.value)){
        showErrorPopover('Veuillez saisir un numéro étudiant valide');
            return;
    }
    else {
      const { value } = e.target;
      setNumEtudiant(e.target.value);
    }
  }


  return (
    <PageContainer title="Mot de passe oublié">
      <AuthForm inputs={inputs} values={values} setValues={setValues} />
      <StyledButton color={"primary"} onClick={handleValidate} content={"Valider"} />
    </PageContainer>
  )
} export default Forgot;