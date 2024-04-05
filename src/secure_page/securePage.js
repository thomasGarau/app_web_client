import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { testSecure } from "./securePageAPI.js";
import { logout } from "../connexion/UserAPI.js";
import { eraseCookie, getTokenAndRole } from "../services/Cookie.js";

import "./securePage.css";
import Header from "../composent/Header.js";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from '@mui/icons-material/Logout';


function SecurePage() {
  const [isSecure, setIsSecure] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchSecureData = async () => {
      try {
        const {token, role} = await getTokenAndRole();
        const response = await testSecure(token , role);
        setIsSecure(response);
      } catch (error) {
        console.error('Erreur lors de la récupération des données sécurisées:', error);
      }
    };

    fetchSecureData();
  }, []);

  async function handleDisconnection() {
    try{
      const {token, role} = getTokenAndRole();
      await logout(token)
      eraseCookie();
    }catch(error){
      console.error('Erreur lors de la déconnexion :', error);
      throw error;
    }finally{
      navigate('/');
    }
  }

  return (
    <div className='style_background'>
      <Header></Header>
      <div className='container1_style'>
        <h1>Espace Eleve</h1><br></br>
        {isSecure}
        <button onClick={handleDisconnection}>Deconnexion</button>
        <IconButton>
          <LogoutIcon className="disconnect_style" onClick={handleDisconnection}/>
        </IconButton>
      </div>
    </div>
  );
}

export default SecurePage;