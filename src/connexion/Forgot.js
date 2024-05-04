import React, { useState } from 'react';
import { Link, Box } from '@mui/material';
import StyledButton from '../composent/StyledBouton';

function Forgot() {
  const [mail, setMail] = useState('');

  const handleValidate = async (e) => {
    e.preventDefault();

    /* Fonction qui retrouvera l'étudiant par le mail dans back */
    /* await Retrieve(email)
      .then(data => {
        const { username, token, days, role } = data;
        if (token) {
          createCookie(token, days, role);
          navigate('/reset_password');
        } else {
          console.log("Erreur de connexion");
        }
      })
      .catch(error => {
        console.error('Erreur lors de l\'authentification :', error);
      }); */

  };

  return (
    <div className='background'>
      <div className='base-container'>
        <h1 style={{ fontFamily: "Nanum Pen Script", fontSize: "4em", margin: "0px" }}>Mot de passe oublie</h1>
        <div className='sub-container'>
          <input
            className='input-connexion'
            style={{ fontFamily: "Nanum Pen Script" }}
            type="mail"
            id="mail"
            name="mail"
            placeholder="votre@mail"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
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