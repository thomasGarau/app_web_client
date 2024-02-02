import React from "react";
import { useNavigate } from 'react-router-dom';
import './Header.css'
import ppImage from './img/pp.png';
import logo from './img/logo_rond.png';
import "@fontsource/nanum-pen-script";

function Header() {

    const navigate = useNavigate();

    const versPagePrincipale = () => {
        navigate('/secure_page');
    }

    const VersProfile = () => {
        navigate('/profile');
    }
    return (
        <div className="head">
            <img 
            className="logo" 
            src={logo} 
            alt="logo"
            onClick={versPagePrincipale}
            />
            <h1 
            className="Nom">TrackMates</h1>
            <img
             className="pp" 
             src={ppImage} 
             alt="pp"
             onClick={VersProfile}
             />
        </div>
    );
}
export default Header;