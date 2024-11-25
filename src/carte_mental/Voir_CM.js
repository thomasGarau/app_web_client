import React, { useState, useEffect, useMemo } from 'react';
import 'reactflow/dist/style.css';
import { useParams, useNavigate } from "react-router-dom";
import StyledButton from '../composent/StyledBouton';
import { getTokenAndRole } from '../services/Cookie';
import {jwtDecode} from 'jwt-decode';


function Voir_CM() {
    const {id_CM} = useParams();
    const [title, setTitle] = useState('');
    const [isCollection, setIsCollection] = useState(null);
    const [image, setImage] = useState(null);
    const [imgUrl, setImgUrl] = useState('https://res.cloudinary.com/dcyjnrgxh/image/upload/v1715891093/image-ue/on8waw6k2tptixnavlbb.png');
    const navigate = useNavigate();
    const [id_utilisateur, setId_utilisateur] = useState(undefined);
    const [id_createur, setId_createur] = useState(undefined);



    async function fetchData(params) {
        const { token } = await getTokenAndRole();
        const decodedToken = jwtDecode(token);
        setId_utilisateur(decodedToken.id_etudiant);
        console.log('id_utilisateur:', id_utilisateur);
    }


    useEffect(() => {
        fetchData();
        console.log('id_utilisateur:', id_utilisateur);
        fetch(`${process.env.PUBLIC_URL}/mindmap1.json`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement du fichier JSON');
                }
                return response.json();
            })
            .then((data) => {
                // Accéder à la section "details" du JSON
                const details = data.details || {};

                // Mettre à jour le titre depuis "details.title"
                setId_createur(data.id_createur);
                setTitle(details.title || 'Carte Mentale');
                setIsCollection(data.is_collection || false);
                setImage(details.image || `${process.env.PUBLIC_URL}/cartementale.png`);
            })
            .catch((error) => {
                console.error('Erreur:', error);
            });
    }, []);

    function navEditCM() {
        navigate(`/edit_carte_mentale/${id_CM}`);
    }

    function handleToggleCollection() {
        setIsCollection(!isCollection); // Basculer l'état
    }

    function handleDeleteCM() {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette carte mentale ?')) {
            // Remplacez par votre logique de suppression (appel API, etc.)
            console.log(`Carte mentale avec ID ${id_CM} supprimée.`);
            navigate('/carte_mental'); // Redirigez après suppression
        }
    }

    function handleDownloadImg() {
        const imageUrl = imgUrl; // Chemin local ou distant
        fetch(imageUrl).then((response) => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération de l\'image');
                }
                return response.blob();
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${title}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => console.error('Erreur lors du téléchargement de l\'image:', error));
    }
    
    



    return (
        <div className='container_voir_cm'>
            <div className='container-voir-cm-boutons'>
            {id_utilisateur === id_createur && (
                <StyledButton
                        content={"Modifier la carte mentale"}
                        color={"primary"}
                        onClick={navEditCM}
                        width={199}
                        fontSize={1}
                />
            )}
                <StyledButton
                    content={"Télécharger la carte mentale"}
                    color={"primary"}
                    onClick={handleDownloadImg}
                    width={199}
                    fontSize={1}
                    
                />

            {id_utilisateur !== id_createur && (
                <StyledButton
                    content={
                        isCollection
                            ? "Supprimer de la collection"
                            : "Ajouter à la collection"
                    }
                    color={"primary"}
                    onClick={handleToggleCollection}
                    width={200}
                    fontSize={1}
                />
            )}
                {id_utilisateur === id_createur && (
                    <StyledButton
                        content={"Supprimer la carte mentale"}
                        color={"primary"}
                        onClick={handleDeleteCM}
                        width={200}
                        fontSize={1}
                    />
                )}
                
            </div>
            <div className='container-voir-cm-image'>
                <h1>{title}</h1>
                <img src='https://coccibel.fr/wp-content/uploads/2023/09/carteMentale-couv.png' alt="Carte mentale" style={{ width: '50%'}} />
            </div>


        </div>
    );
}

export default Voir_CM;
