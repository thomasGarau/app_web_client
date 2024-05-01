import React, { useState } from 'react';
import Header from '../composent/Header';
import { Link, Box } from '@mui/material';

function Reset() {

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleReset = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            // Affichez ici un message d'erreur ou gérez la validation
            console.error("Les mots de passe ne correspondent pas.");
            return;
        }
        /* Fonction qui réinitialisera le mot de passe de l'étudiant dans le back */
        /* await ResetPassword(password)
          .then(data => {
            const { username, token, days, role } = data;
            if (token) {
              createCookie(token, days, role);
              navigate('/reset_password');
            } else {
              console.log("Erreur de connexion");
            }
          })
          .catch(error => {
            console.error('Erreur lors de l\'authentification :', error);
          }); */

    };

    return (
        <div className='background'>
            <div className='base-container'>
                <h1 style={{ fontFamily: "Nanum Pen Script", fontSize: "4em", margin: "0px" }}>Reinitialiser le mot de passe</h1>
                <div className='sub-container'>
                    <input
                        className='input-connexion'
                        type="password"
                        id="password"
                        name="password"
                        placeholder='Nouveau mot de passe'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        className='input-connexion'
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder='Confirmer le mot de passe'
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button
                    style={{ fontFamily: "Nanum Pen Script" }}
                    className='reg-button button-connection'
                    onClick={handleReset}>Valider</button>

            </div>

        </div>
    )
} export default Reset;