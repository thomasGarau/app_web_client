import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "@fontsource/nanum-pen-script";
import Header from '../composent/Header.js';
import { Registry } from './UserAPI.js';
import { createCookie } from '../services/Cookie.js';
import './Connexion.css';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Nouvel état pour la confirmation du mot de passe

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            // Affichez ici un message d'erreur ou gérez la validation
            console.error("Les mots de passe ne correspondent pas.");
            return;
        }

        await Registry(email, password)
            .then(data => {
                const { token, days } = data;
                if (token) {
                    createCookie(token, days);
                    navigate('/secure_page');
                } else {
                    console.log("Erreur lors de l'inscription");
                }
            })
            .catch(error => {
                console.error('Erreur lors de l\'inscription :', error);
            });
    };

    const toConnection = (e) => {
        e.preventDefault();
        navigate('/connexion');
    };

    return (
        <div className='background'>
            <Header></Header>
            <div className='base-container'>
                <h1 style={{ fontFamily: "Nanum Pen Script", fontSize: "4.5vw", margin: "0px" }}>Inscription</h1>
                <div className='sub-container'>
                    <input
                        className='input-connexion'
                        type="email"
                        id="email"
                        name="email"
                        placeholder='email...'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className='input-connexion'
                        type="password"
                        id="password"
                        name="password"
                        placeholder='password..'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        className='input-connexion'
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder='Confirm password..'
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div className='buttons-container'>
                    <button 
                        className='reg-button button-connection'
                        onClick={toConnection}>
                            Connexion
                    </button>
                    <button 
                        className='valid-button button-connection' 
                        onClick={handleRegister}>
                            Valider
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register;
