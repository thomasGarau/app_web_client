import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Remplacez "Switch" par "Routes"
import PrivateRoute from './services/PrivateRoutes';
import Principal from './principal/Principal';
import Connexion from './connexion/Connexion';
import Register from './connexion/Register';
import Liste_ue from './liste_ue/Liste_ue';
import Carte_mental from './carte_mental/Carte_mental';
import SecurePage from './secure_page/securePage';
function App() {
  return (
    <Router>
      <Routes> {/* Utilisez la composante "Routes" au lieu de "Switch" */}
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/register" element={<Register />} />
        <Route path="/liste_ue" element={<PrivateRoute><Liste_ue /></PrivateRoute>} /> 
        <Route path="/carte_mental" element={<PrivateRoute><Carte_mental /></PrivateRoute>} />
        <Route path="/secure_page" element={<PrivateRoute><SecurePage /></PrivateRoute>} />
        <Route path="/" element={<Principal />} /> 
      </Routes>
    </Router>
  );
}

export default App;
