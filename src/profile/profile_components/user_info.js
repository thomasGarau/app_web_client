import React, { useState, useRef, useEffect } from "react";
import { Avatar, Typography, Popover, Backdrop, CircularProgress } from "@mui/material";
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import CakeIcon from '@mui/icons-material/Cake';
import StyledButton from "../../composent/StyledBouton";
import { getUserInfo, updateUserProfilePicture } from "../../API/ProfileAPI";
import '../Profile.css';

export default function UserInfo() {
    const [user, setUser] = useState('');
    const [role, setRole] = useState('');
    const [picture, setPicture] = useState({});
    const [imagePreviewUrl, setImagePreviewUrl] = useState(`${process.env.PUBLIC_URL}/img/pp.png`);
    const fileInputRef = useRef(null);
    const [errorAnchorEl, setErrorAnchorEl] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [openPopOver, setOpenPopOver] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [id, setId] = useState(undefined);

    const handleUpload = () => {
        fileInputRef.current.click();
    };

    const photoUpload = async (e) => {
        e.preventDefault();
        setPicture({
            picturePreview: URL.createObjectURL(e.target.files[0]),
            pictureAsFile: e.target.files[0],
        });
    };

    useEffect(() => {
        const sendImage = async () => {
            if (picture.pictureAsFile) {
                try {
                    setOpenBackdrop(true);
                    const formData = new FormData();
                    formData.append('path', picture.pictureAsFile);
                    await updateUserProfilePicture(formData);
                    setImagePreviewUrl(URL.createObjectURL(picture.pictureAsFile));
                    window.location.reload();
                } catch (error) {
                    console.error('Error uploading profile picture:', error);
                }            
            }
            setOpenBackdrop(false);
        };
        sendImage();      
    }, [picture]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const user = await getUserInfo();
                setUser(user);
                console.log(user);
                setRole(user.role);
            } catch (error) {
                console.error('Erreur lors de la récupération des informations utilisateurs:', error);
            }
        };
        fetchUserInfo();
    }, [imagePreviewUrl]);

    const handleClosePopover = () => {
        setErrorAnchorEl(null);
        setErrorMessage('');
        setOpenPopOver(false);
    };

    return (
        <div className="user-container-profile">
            <div className="user-container">
                <Typography sx={{ marginTop: "20px", fontSize: { xs: "1.5em", sm: "2.25em", md: "3em" }, fontWeight: "bold" }}>
                    BONJOUR {user.nom} {user.prenom}!
                </Typography>
                {role === 'etudiant' && (
                    <div className="div-formation">
                        <HomeRepairServiceIcon fontSize="large" />
                        <span className="formation-text">Formation: {user.formation}</span>
                    </div>
                )}
                <div className="div-formation">
                    <CakeIcon fontSize="large" />
                    <span className="formation-text">Naissance: {user.anniversaire}</span>
                </div>
            </div>

            <div className="change-profile">
                <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={photoUpload} />
                <Avatar className="pp-change-profile" src={user.url} alt="pp" sx={{ width: { xs: 50, sm: 75, md: 100 }, height: { xs: 50, sm: 75, md: 100 } }} />
                <StyledButton content={"Modifier"} color={"primary"} onClick={handleUpload} />
            </div>

            <Popover
                id={id}
                open={openPopOver}
                anchorEl={errorAnchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Typography sx={{ p: 2 }}>{errorMessage}</Typography>
            </Popover>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}
