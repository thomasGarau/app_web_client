import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "@fontsource/nanum-pen-script";
import { Registry } from './UserAPI.js';
import { createCookie } from '../services/Cookie.js';
import './Connexion.css';
import StyledButton from '../composent/StyledBouton.js';
import { Box, Checkbox, FormControlLabel, FormGroup, Modal, Popover, Typography } from '@mui/material';


const style = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: '70%', md: '50%' },
    bgcolor: 'background.paper',
    border: '2px solid #133D56',
    boxShadow: 24,
    borderRadius: 2,
    Typography: 4,
    height: '90vh',
};


function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorAnchorEl, setErrorAnchorEl] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [id, setId] = useState(undefined);
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [checkedGeneral, setCheckedGeneral] = useState(false);
    const [checkedTracking, setCheckedTracking] = useState(false);
    const handleCloseModal = () => setOpenModal(false);

    const navigate = useNavigate();

    const handleOpenModal = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage('Veuillez saisir une adresse e-mail valide.');
            setErrorAnchorEl(document.getElementById('email'));
            setId('error-popover');
            setOpen(true);
            return;
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{12,})/;
        if (password !== confirmPassword) {
            setErrorMessage('Mot de passe différent! Veuillez réessayer.');
            setErrorAnchorEl(document.getElementById('confirmPassword'));
            setId('error-popover');
            setOpen(true);
            console.error("Les mots de passe ne correspondent pas.");
            return;
        }
        if (!passwordRegex.test(password)) {
            setErrorMessage('Le mot de passe doit contenir au moins une majuscule, un caractère spécial et faire 12 caractères ou plus.');
            setErrorAnchorEl(document.getElementById('password'));
            setId('error-popover');
            setOpen(true);
            return;
        }
        setOpenModal(true);
    };

    const handleChangeGeneral = (event) => {
        setCheckedGeneral(event.target.checked);
    };

    const handleChangeTracking = (event) => {
        setCheckedTracking(event.target.checked);
    };

    const handleRegister = async () => {
        const tracking = checkedTracking ? 0 : 1;
        await Registry(email, password, tracking)
            .then(data => {
                const { token, days } = data;
                if (token) {
                    createCookie(token, days);
                    navigate('/home');
                } else {
                }
            })
            .catch(error => {
                setOpenModal(false);
                console.error('Erreur lors de l\'inscription :', error);
                setErrorMessage('Vous n\'êtes pas autorisé à vous inscrire, ou un compte avec cet email existe déjà.');
                setErrorAnchorEl(document.getElementById('email'));
                setId('error-popover');
                setOpen(true);
            });
    };

    const handleClosePopover = () => {
        setErrorAnchorEl(null);
        setErrorMessage('');
        setOpen(false);
    };

    const toConnection = (e) => {
        e.preventDefault();
        navigate('/connexion');
    };

    return (
        <div className='background'>
            <div className='base-container'>
                <Typography sx={{ fontSize: { xs: "2em", sm: "3em", md: "4em" }, margin: "0px" }}>Inscription</Typography>
                <div className='sub-container'>
                    <input
                        aria-describedby='error-popover'
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
                        aria-describedby='error-popover'
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
                        aria-describedby='error-popover'
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
                    <StyledButton
                        color={"secondary"}
                        onClick={toConnection}
                        content={"Connexion"}>
                    </StyledButton>
                    <StyledButton
                        className='valid-button button-connection'
                        color={"primary"}
                        content={"Valider"}
                        onClick={handleOpenModal}>
                    </StyledButton>
                </div>
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
                <Modal
                    open={openModal}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography sx={{ fontSize: { xs: "1.3em", sm: "1.6em", md: "2" }, fontWeight: "bold", padding: "5px" }}>
                            Conditions Générales d'Utilisation de TrackMates
                        </Typography>
                        <Box sx={{ overflowY: "auto", padding: { xs: "5px", sm: "10px", md: "15px" } }}>
                            <Typography id="modal-modal-description" sx={{ fontSize: { xs: "0.8em", sm: "1em", md: "1.3em" } }}>
                                Bienvenue sur TrackMates, votre plateforme d'e-learning conçue pour enrichir l'expérience éducative des étudiants universitaires. Grâce à notre partenariat avec des institutions académiques, les étudiants bénéficient d'accès à des cours élaborés par leurs propres enseignants, ainsi qu'à des outils interactifs tels que des quizz, des cartes mentales et des forums de discussion. TrackMates propose également des calendriers de révision personnalisés qui recommandent des sessions d'étude spécifiques pour optimiser l'apprentissage.
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2, fontSize: { xs: "0.8em", sm: "1em", md: "1.3em" }, fontWeight: "bold" }}>
                                1. Protection des Données et Confidentialité
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ fontSize: { xs: "0.7em", sm: "0.9em", md: "1.2em" } }}>
                                Localisation des Données : Toutes les données collectées par TrackMates sont exclusivement hébergées et traitées en France. Nous nous engageons à ne pas transférer vos données en dehors de ce territoire.
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ fontSize: { xs: "0.7em", sm: "0.9em", md: "1.2em" } }}>
                                Usage des Données : Les informations que nous collectons sont strictement utilisées pour le fonctionnement de l'application et ne sont jamais exploitées à des fins commerciales. Ces données nous permettent d'optimiser nos services et d'assurer une expérience utilisateur fluide et efficace.
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2, fontSize: { xs: "0.8em", sm: "1em", md: "1.3em" }, fontWeight: "bold" }}>
                                2. Utilisation des Cookies
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ fontSize: { xs: "0.7em", sm: "0.9em", md: "1.2em" } }}>
                                Cookies d'Authentification : TrackMates utilise des cookies uniquement pour gérer les informations d'authentification de nos utilisateurs. Ces cookies sont essentiels pour maintenir les sessions des utilisateurs actives et sécurisées. Ils ne servent à aucune autre forme de suivi ou de publicité.
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2, fontSize: { xs: "0.8em", sm: "1em", md: "1.3em" }, fontWeight: "bold" }}>
                                3. Suivi de l'Activité sur la Plateforme
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ fontSize: { xs: "0.7em", sm: "0.9em", md: "1.2em" } }}>
                                Tracking Optionnel : Dans le but d'améliorer continuellement notre système de recommandation et de personnaliser l'expérience utilisateur, TrackMates offre une fonction de suivi facultative. Cette fonction enregistre les interactions avec les cours (clics, défilements et temps passé).
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ fontSize: { xs: "0.7em", sm: "0.9em", md: "1.2em" } }}>
                                Désactivation du Suivi : Le tracking est entièrement optionnel et peut être désactivé à tout moment par l'utilisateur. Pour ce faire, il suffit de ne pas cocher la case correspondante lors de l'acceptation des conditions générales. Veuillez noter que les utilisateurs qui choisissent de ne pas activer cette fonctionnalité ne bénéficieront pas des avantages de nos recommandations personnalisées.
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2, fontSize: { xs: "0.8em", sm: "1em", md: "1.3em" }, fontWeight: "bold" }}>
                                4. Acceptation des Conditions
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ fontSize: { xs: "0.7em", sm: "0.9em", md: "1.2em" } }}>
                                En utilisant TrackMates, vous reconnaissez avoir lu et accepté ces conditions d'utilisation. Nous vous encourageons à revoir régulièrement cette page pour prendre connaissance des éventuelles mises à jour ou modifications
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-evenly", width: "100%", borderTop: "2px solid #133D56", justifyContent:"flex-start" }}>
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <FormGroup sx={{paddingLeft: "20px"}}>
                                    <FormControlLabel control={<Checkbox checked={checkedGeneral}
                                        onChange={handleChangeGeneral} />} label="J'accepte les conditions générales d'utilisation" />
                                    <FormControlLabel control={<Checkbox checked={checkedTracking}
                                        onChange={handleChangeTracking} />} label="J'accepte que l'application enregistre des données pour un suivi personnalisé" />

                                </FormGroup>
                                <StyledButton
                                    isDisabled={!checkedGeneral}
                                    onClick={handleRegister}
                                    width={300}
                                    color={'primary'}
                                    content={"Valider l'inscription"} />
                            </Box>
                        </Box>
                    </Box>
                </Modal>
            </div>
        </div >
    );
}

export default Register;
