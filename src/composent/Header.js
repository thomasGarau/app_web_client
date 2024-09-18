import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './Header.css'
import "@fontsource/nanum-pen-script";
import "@fontsource/caveat"
import "@fontsource/shadows-into-light"
import { getUserInfo } from "../API/ProfileAPI";
import { Avatar } from "@mui/material";

function Header() {

    const [user, setUser] = useState('')
    const navigate = useNavigate();

    const versPagePrincipale = (e) => {
        e.preventDefault();
        navigate('/home');
    }

    const VersProfile = (e) => {
        e.preventDefault();
        navigate('/profile');
    }

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const user = await getUserInfo();
                setUser(user);
            } catch (error) {
                console.error('Erreur lors de la récupération des informations utilisateurs:', error);
            }
        };
        fetchUserInfo();
    }, [])

    return (
        <div className="head">
            <Avatar
                className="logo"
                src={`${process.env.PUBLIC_URL}/logo_rond.png`}
                alt="logo"
                onClick={versPagePrincipale}
                sx={{ width: {xs: 50, sm: 75, md: 100}, height: {xs: 50, sm: 75, md: 100} }}
            />
            <h1
                className="Nom">TrackMates</h1>
            <Avatar
                className="pp"
                src={user.url}
                alt="pp"
                sx={{ width: {xs: 50, sm: 75, md: 100}, height: {xs: 50, sm: 75, md: 100} }}
                onClick={VersProfile}
            />

        </div>
    );
}
export default Header;