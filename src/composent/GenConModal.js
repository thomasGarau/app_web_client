import React from 'react';
import { Modal, Box, Typography } from '@mui/material';

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

const GenConModal = ({ open, handleClose, title, children }) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography sx={{ fontSize: { xs: "1.3em", sm: "1.6em", md: "2" }, fontWeight: "bold", padding: "5px" }}>
                    {title}
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
                <Box sx={{ display: "flex", justifyContent: "space-evenly", width: "100%", borderTop: "2px solid #133D56", justifyContent: "flex-start" }}>
                    {children}
                </Box>
            </Box>
        </Modal>
    );
};

export default GenConModal;
