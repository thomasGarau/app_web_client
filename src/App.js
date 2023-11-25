import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Remplacez "Switch" par "Routes"
import Principal from './Principal';
import Connexion from './connexion/Connexion'
import Register from './connexion/Register'
import Liste_ue from './liste_ue/Liste_ue'
import Carte_mental from './carte_mental/Carte_mental'
import SecurePage from './secure_page/securePage';
function App() {
  return (
    <Router>
      <Routes> {/* Utilisez la composante "Routes" au lieu de "Switch" */}
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/register" element={<Register />} />
        <Route path="/liste_ue" element={<Liste_ue />} /> 
        <Route path="/carte_mental" element={<Carte_mental />} />
        <Route path="/secure_page" element={<SecurePage />} />
        <Route path="/" element={<Principal />} /> 
      </Routes>
    </Router>
  );
}

export default App;
