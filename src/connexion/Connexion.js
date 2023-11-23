// Accueil.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Authenticate} from './ConnexionAPI.js';

function Connexion() {   
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

const navigate = useNavigate();

const handleLogin = (e) => {
  e.preventDefault();
  Authenticate(username, password);
};

return (
  <div>
    <h1>Page de Connexion</h1>
    <label htmlFor="username">Nom d'utilisateur :</label>
    <input
      type="text"
      id="username"
      name="username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />

    <label htmlFor="password">Mot de passe :</label>
    <input
      type="password"
      id="password"
      name="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button onClick={handleLogin}>Se connecter</button>
  </div>
);
}export default Connexion;
