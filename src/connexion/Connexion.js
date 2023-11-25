//dependances
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//modules
import {Authenticate} from './ConnexionAPI.js';
import {createCookie, getToken, eraseCookie} from '../services/Cookie.js';

function Connexion() {   
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  await Authenticate(username, password)
  .then(data => {
    const {username, token, days} = data;
    if (token) {
      createCookie(username, token, days);
      console.log(getToken(username));
      navigate('/secure_page');
    } else {
      console.log("Erreur de connexion");
    }
  })
  .catch(error => {
    console.error('Erreur lors de l\'authentification :', error);
  });

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
