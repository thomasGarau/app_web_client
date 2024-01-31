import React from "react";
import { useNavigate } from 'react-router-dom';
import './Header.css'
import ppImage from './img/pp.png';
import logo from './img/logo_rond.png';
import "@fontsource/nanum-pen-script";

function Header() {
    return (
        <div className="head">
            <img className="logo" src={logo} alt="logo" />
            <h1 className="Nom">TrackMates</h1>
            <img className="pp" src={ppImage} alt="pp" />
        </div>
    );
}
export default Header;