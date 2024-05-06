import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import './Header.css'
import ppImage from './img/pp.png';
import logo from './img/logo_rond.png';
import "@fontsource/nanum-pen-script";
import "@fontsource/caveat"
import "@fontsource/shadows-into-light"
import { getUserInfo } from "../profile/ProfileAPI";

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
             src={user.url} 
             alt="pp"
             onClick={VersProfile}
             />
        </div>
    );
}
export default Header;