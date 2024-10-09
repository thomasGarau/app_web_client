//dependances
import React from 'react';

//modules
import { Link } from '@mui/material';
import '../Connexion.css';
import "@fontsource/nanum-pen-script";
import StyledButton from '../../composent/StyledBouton.js';
import PageContainer from '../connexion_component/PageContainer.js';
import AuthForm from '../connexion_component/AuthForm.js';
import PopoverError from '../../composent/PopoverError.js';

function Connexion({ inputs, values, setValues, idEl, openAnchor, errorAnchorEl,handleClosePopover,errorMessage, toRegister, handleLogin }) {

  return (
    <PageContainer title="Connexion">
      <AuthForm inputs={inputs} values={values} setValues={setValues} />
      <Link sx={{ fontSize: { xs: "1em", sm: "1.5em", md: "2em" }, color: "#000" }} href="/forgot_password" underline='always'>Mot de passe oublié?</Link>
      <div className='buttons-container'>
        <StyledButton color={"secondary"} onClick={toRegister} content={"Inscription"} />
        <StyledButton color={"primary"} onClick={handleLogin} content={"Valider"} />
      </div>
      <PopoverError
        id={idEl}
        open={openAnchor}
        anchorEl={errorAnchorEl}
        onClose={handleClosePopover}
        errorMessage={errorMessage} />
    </PageContainer>
  );
} export default Connexion;
