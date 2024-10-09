import React from "react";
import UserInfo from "./profile_components/user_info";
import GestionQuizz from "./profile_components/gestion_quizz";
import StyledButton from "../composent/StyledBouton";
import { useNavigate } from "react-router-dom";
import { eraseCookie, getTokenAndRole } from "../services/Cookie";
import { logout } from "../API/UserAPI";
import './Profile.css';

export default function Profile() {
    const navigate = useNavigate();

    async function handleDisconnection() {
        try {
            const { token } = getTokenAndRole();
            await logout(token);
            eraseCookie();
        } catch (error) {
            console.error('Erreur lors de la déconnexion :', error);
            throw error;
        } finally {
            navigate('/');
        }
    }

    return (
        <div className='style-background-profile'>
            <UserInfo />
            <GestionQuizz />
            <StyledButton color={"primary"} content={"Déconnexion"} onClick={handleDisconnection} />
        </div>
    );
}
