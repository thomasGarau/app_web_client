import { useState } from "react";
import useErrorPopover from '../../composent/useErrorPopover.js';
import Connexion from "./Connexion";
import { useNavigate } from "react-router-dom";
import { Authenticate } from "../../API/UserAPI.js";
import { decodeJWT } from "../../services/decode.js";
import { createCookie } from "../../services/Cookie.js";

function ConnexionContainer() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const inputs = [
        { type: "text", id: "username", name: "username", placeholder: "N° Etudiant", value: username },
        { type: "password", id: "password", name: "password", placeholder: "Mot de passe", value: password }
    ];
    const values = { username, password };
    const setValues = (newValues) => {
        setUsername(newValues.username);
        setPassword(newValues.password);
    };
    const { errorMessage, errorAnchorEl, id, openAnchor, showErrorPopover, handleClosePopover } = useErrorPopover();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const data = await Authenticate(username, password);
            const { token, days } = data;
            if (token) {
                const tokenInfo = decodeJWT(token);
                createCookie(token, days, tokenInfo.role);
                navigate('/home');
            } else {
            }
        } catch (error) {
            console.error('Erreur lors de l\'authentification :', error);
            var message = '';
            var id = '';
            if (!username.trim()) {
                message = 'Veuillez remplir tous les champs.';
                id = 'username';
            } else if (!password.trim()) {
                message = 'Veuillez remplir tous les champs.';
                id = 'password';
            } else {
                message = 'Mot de passe invalide! Veuillez réessayer.';
                id = 'password';

            }
            showErrorPopover(message, id);
        };
    };

    const toRegister = async (e) => {
        e.preventDefault();
        navigate('/register');
    };

    return <Connexion
        inputs={inputs}
        values={values}
        setValues={setValues}
        idEl={id}
        openAnchor={openAnchor}
        errorMessage={errorMessage}
        errorAnchorEl={errorAnchorEl} 
        handleClosePopover={handleClosePopover}
        handleLogin={handleLogin}
        toRegister={toRegister}
        />

} export default ConnexionContainer;

