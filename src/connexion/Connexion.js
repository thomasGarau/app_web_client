// Accueil.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Connexion() {   
  const [username, setUsername] = useState('');
const [password, setPassword] = useState('');

const navigate = useNavigate();

const handleLogin = (e) => {
  e.preventDefault();

  const isValidLogin = username === 'admin' && password === 'admin';

  if (isValidLogin) {
    navigate('/liste_ue');
  } else {
    alert('Nom d\'utilisateur ou mot de passe incorrect.');
  }
};

return (
  <div>
    <h1>Page de Connexion</h1>
    <form onSubmit={handleLogin}>
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

      <button type="submit">Se connecter</button>
    </form>
  </div>
);
}

export default Connexion;
