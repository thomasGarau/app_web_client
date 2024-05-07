import React, { useState, useRef, useEffect } from "react";
import './Profile.css'
import { Select, InputLabel, FormControl, MenuItem, Modal, Box, Typography, Popover, Avatar } from "@mui/material";
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import CakeIcon from '@mui/icons-material/Cake';
import ppImage from '../composent/img/pp.png';
import StyledButton from "../composent/StyledBouton";
import { getListQuizzCreateForUser, getListQuizzStatForUser, getUserInfo, updateUserProfilePicture } from "./ProfileAPI";
import { useNavigate } from "react-router-dom";
import { logout } from "../connexion/UserAPI";
import { eraseCookie, getTokenAndRole } from "../services/Cookie";

export default function Profile() {
    const [user, setUser] = useState('')
    const [listQuizz, setListQuizz] = useState([])

    const [quizz, setQuizz] = useState('')
    const [profilePic, setProfilePic] = useState(ppImage)
    const [imagePreviewUrl, setImagePreviewUrl] = useState(ppImage)
    const [errorAnchorEl, setErrorAnchorEl] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [id, setId] = useState(undefined);
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState('');
    const [picturePreview, setPicturePreview] = useState(null);
    const [picture, setPicture] = useState({})

    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const handleChangeQuizz = (event) => {
        setQuizz(event.target.value);
        console.log(quizz)
    };

    const handleUpload = () => {
        fileInputRef.current.click();
    };

    const photoUpload = async (e) => {
        e.preventDefault();
        console.log(e.target.files[0])
        setPicture({
            picturePreview: URL.createObjectURL(e.target.files[0]),
            pictureAsFile: e.target.files[0],
        })

    }


    useEffect(() => {
        const sendImage = async () => {
            if (picture.pictureAsFile) {
                try {
                    // Créer un objet FormData
                    const formData = new FormData();
                    console.log(picture.pictureAsFile);
                    formData.append('path', picture.pictureAsFile);
                    for (var key of formData.entries()) {
                        console.log(key[0] + ', ' + key[1])
                    }
                    // Mettre à jour l'image de profil
                    await updateUserProfilePicture(formData);
                    // Mettre à jour l'URL de l'image dans le state
                    setImagePreviewUrl(URL.createObjectURL(picture.pictureAsFile));
                    window.location.reload();
                } catch (error) {
                    console.error('Error uploading profile picture:', error);
                }
            }
        }
        sendImage();
    }, [picture]);

    const toStatQuizz = () => {
        if (quizz === '') {
            setErrorMessage('Vous n\'avez pas sélectionné de quizz!');
            setErrorAnchorEl(document.getElementById('label-quizz'));
            setId('error-popover');
            setOpen(true);
            return
        }
        navigate(`/statQuizz/${quizz.id_quizz}/${quizz.id_note_quizz}`);

    }

    const toGestionQuizz = () => {

        navigate(`/gestion_quizz`);

    }

    const toGestionQuizzProf = () => {
        navigate(`/gestion_quizz/prof`);
    }

    useEffect(() => {
        const fetchListQuizz = async () => {
            try {
                const quizzs = await getListQuizzStatForUser();
                setListQuizz(quizzs);
                console.log(quizzs)
            } catch (error) {
                console.error('Erreur lors de la récupération des quizz:', error);
            }
        };
        const fetchUserInfo = async () => {
            try {
                const user = await getUserInfo();
                setUser(user);
                setRole(user.role);
                console.log(user)
            } catch (error) {
                console.error('Erreur lors de la récupération des informations utilisateurs:', error);
            }
        };
        fetchListQuizz();
        fetchUserInfo();
    }, [])

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const user = await getUserInfo();
                setUser(user);
                setRole(user.role);
                console.log(user)
            } catch (error) {
                console.error('Erreur lors de la récupération des informations utilisateurs:', error);
            }
        };
        fetchUserInfo();
    }, [imagePreviewUrl])

    const handleClosePopover = () => {
        setErrorAnchorEl(null);
        setErrorMessage('');
        setOpen(false);
    };

    async function handleDisconnection() {
        try {
            const { token, role } = getTokenAndRole();
            await logout(token)
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

            <div className="user-container">
                <Typography sx={{
                    marginTop: "20px", fontSize: {
                        xs: "1.5em",
                        sm: "2.25em",
                        md: "3em"
                    },
                    fontWeight: "bold"
                }}>BONJOUR {user.nom} {user.prenom}!</Typography>
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
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={photoUpload}
                />
                <Avatar
                    className="pp-change-profile"
                    src={user.url}
                    alt="pp"
                    sx={{ width: {xs: 50, sm: 75, md: 100}, height: {xs: 50, sm: 75, md: 100} }}
                />
                <StyledButton
                    content={"Modifier"}
                    color={"primary"}
                    onClick={handleUpload}
                />
            </div>
            {listQuizz.length > 0 && (
                <FormControl className="profile-select" sx={{ m: 1, width: "60%", alignItems: "center" }} >
                    <InputLabel id="label-quizz">Statistiques des quizz</InputLabel>
                    <Select
                        sx={{
                            width: "100%",
                            borderRadius: "10px",
                            backgroundColor: "#f0f0f0"
                        }}
                        labelId="label-quizz"
                        id="demo-simple-select"
                        value={quizz}
                        label="aaaaaaaaaaaaaaaaaaaaaa"
                        onChange={handleChangeQuizz}
                    >
                        {listQuizz.map((quizz, index) => (
                            <MenuItem key={index} value={quizz}>
                                {quizz.label}
                            </MenuItem>
                        ))}
                    </Select>

                    <StyledButton
                        content={"Selectionner"}

                        color={"primary"}
                        onClick={toStatQuizz} />
                </FormControl>
            )}
            {role === 'etudiant' && (
                <StyledButton
                    content={"Gestion de vos quizz"}
                    color={"primary"}
                    onClick={toGestionQuizz} />
            )}
            {role === 'enseignant' && (
                <StyledButton
                    content={"Gestion de vos quizz"}
                    color={"primary"}
                    onClick={toGestionQuizzProf} />
            )}
            <StyledButton color={"primary"} content={"Déconnexion"} onClick={handleDisconnection} />
            <Popover
                id={id}
                open={open}
                anchorEl={errorAnchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Typography sx={{ p: 2 }}>{errorMessage}</Typography>
            </Popover>

        </div>
    )

}
