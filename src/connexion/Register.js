//dependances
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//modules
import {Registry} from './ConnexionAPI.js';
import {createCookie, readCookie, eraseCookie} from '../services/Cookie.js';

function Register(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [firstName, setFirstName] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        await Registry(username, password, name, firstName)
        .then(data => {
            const {username, token, days} = data;
            if (token) {
              createCookie(username, token, days);
              navigate('/secure_page');
            } else {
              console.log("Erreur lors de l'inscription");
            }
          })
          .catch(error => {
            console.error('Erreur lors de l\'inscription :', error);
          });
    };

    return(
        <div>

            <label htmlFor="firstName">Prenom :</label>
            <input
                type="firstName"
                id="firstName"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            
            <label htmlFor="name">Nom :</label>
            <input
                type="name"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            
            <label htmlFor="username">Identifiant :</label>
            <input
                type="username"
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

            <button onClick={handleRegister}>S'inscrire</button>

        </div>

    );
}export default Register;