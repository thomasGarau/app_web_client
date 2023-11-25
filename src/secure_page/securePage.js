import React, { useState, useEffect } from "react";
import { testSecure } from "./securePageAPI.js";
import { getTokenAndRole } from "../services/Cookie.js";

function SecurePage() {
  const [isSecure, setIsSecure] = useState(null);

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

  return (
    <div>
      <h1>Page sécurisée</h1>
      {isSecure}
    </div>
  );
}

export default SecurePage;