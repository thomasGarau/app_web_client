import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Remplacez "Switch" par "Routes"
import Principal from './Principal';
import Connexion from './connexion/Connexion'

function App() {
  return (
    <Router>
      <Routes> {/* Utilisez la composante "Routes" au lieu de "Switch" */}
        <Route path="/" element={<Principal />} /> 
        <Route path="/connexion" element={<Connexion />} /> 
      </Routes>
    </Router>
  );
}

export default App;
