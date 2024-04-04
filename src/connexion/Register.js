//dependances
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//modules
import { Registry } from './UserAPI.js';
import { createCookie, readCookie, eraseCookie } from '../services/Cookie.js';
import './Connexion.css';
import "@fontsource/nanum-pen-script";
import Header from '../composent/Header.js';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [firstName, setFirstName] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        await Registry(username, password, name, firstName)
            .then(data => {
                const { username, token, days } = data;
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

    const toConnection = async (e) => {
        e.preventDefault();
        navigate('/connexion');
    }

    return (
        <div className='background'>
            <Header></Header>
            <div className='base-container'>
                <h1 style={{ fontFamily: "Nanum Pen Script", fontSize: "6vw", margin: "0px" }}>Inscription</h1>
                <div className='sub-container'>
                    <input
                        className='input-connexion'
                        style={{ fontFamily: "Nanum Pen Script"}}
                        type="user"
                        id="user"
                        name="user"
                        placeholder='email...'
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                        className='input-connexion'
                        style={{ fontFamily: "Nanum Pen Script"}}
                        type="name"
                        id="name"
                        name="name"
                        value={name}
                        placeholder='Nom'
                        required
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className='input-connexion'
                        style={{ fontFamily: "Nanum Pen Script"}}
                        type="username"
                        id="username"
                        name="username"
                        placeholder='Pseudo'
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className='input-connexion'
                        style={{ fontFamily: "Nanum Pen Script"}}
                        type="password"
                        id="password"
                        name="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className='buttons-container'>
                    <button 
                        style={{ fontFamily: "Nanum Pen Script"}} 
                        className='reg-button button-connection'
                        onClick={toConnection}>
                            Connexion
                    </button>
                    <button 
                        style={{ fontFamily: "Nanum Pen Script"}} 
                        className='valid-button button-connection' 
                        onClick={handleRegister}>
                            Valider
                    </button>
                </div>
            </div>
        </div>

    );
} export default Register;