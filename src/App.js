import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Remplacez "Switch" par "Routes"
import Principal from './Principal';
import Connexion from './connexion/Connexion'
import Liste_ue from './liste_ue/Liste_ue'
import Carte_mental from './carte_mental/Carte_mental'
function App() {
  return (
    <Router>
      <Routes> {/* Utilisez la composante "Routes" au lieu de "Switch" */}
        <Route path="/" element={<Principal />} /> 
        <Route path="/connexion" element={<Connexion />} /> 
        <Route path="/liste_ue" element={<Liste_ue />} /> 
        <Route path="/carte_mental" element={<Carte_mental />} />
      </Routes>
    </Router>
  );
}

export default App;
