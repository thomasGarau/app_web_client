import React, { useState, useEffect, useMemo } from 'react';
import 'reactflow/dist/style.css';
import { useParams, useNavigate } from "react-router-dom";
import StyledButton from '../composent/StyledBouton';
import { getTokenAndRole } from '../services/Cookie';
import {jwtDecode} from 'jwt-decode';
import { getCMInfo, addCmToCollection, deleteCmFromCollection, deleteCM } from '../API/CmAPI';


function Voir_CM() {
    const {id_chap, id_CM} = useParams();
    const [title, setTitle] = useState('');
    const [isCollection, setIsCollection] = useState(null);
    const [image, setImage] = useState(null);
    const navigate = useNavigate();
    const [id_user, setid_user] = useState(undefined);
    const [id_createur, setId_createur] = useState(undefined);
    const [is_proprio, setis_proprio] = useState(undefined);



    async function fetchData(params) {
        const { token } = await getTokenAndRole();
        const decodedToken = jwtDecode(token);
        setid_user(decodedToken.id_etudiant);
    }



useEffect(() => {

    if(id_CM === undefined) {
        navigate(`/carte_mentale/${id_chap}`);
    }
    const fetchAllData = async () => {
        await fetchData(); 
        const data = await getCMInfo(id_CM);
        console.log(data);
        if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
            navigate(`/carte_mentale/${id_chap}`);
            return;
        }
        setId_createur(data.id_utilisateur);
        setTitle(data.titre || 'Carte Mentale');
        setIsCollection(data.is_collection || false);
        setImage(data.url || '');
        setis_proprio(id_user === id_createur);
    };

    fetchAllData().catch((error) => console.error('Erreur:', error));
}, [is_proprio, id_CM, id_user]);


    function navEditCM() {
        navigate(`/edit_carte_mentale/${id_chap}/${id_CM}`);
    }

    async function handleToggleCollection() {
        if(isCollection) {
            await deleteCmFromCollection(id_CM);
        }
        else {
            await addCmToCollection(id_CM);
        }
        setIsCollection(!isCollection); 
    }

    async function handleDeleteCM() {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette carte mentale ?')) {
            // Remplacez par votre logique de suppression (appel API, etc.)
            await deleteCM(id_CM);
            navigate(`/carte_mentale/${id_chap}`); 
        }
    }

    function handleDownloadImg() {
        const imageUrl = image; 
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
    
    function handleRetour()  {
        navigate('/carte_mentale/' + id_chap);
      }
    


    return (
        <div className='container_voir_cm'>
            <div className='container-voir-cm-boutons'>

            <StyledButton
                    content={"Retour"}
                    color={"primary"}
                    onClick={handleRetour}
                    width={"200"}
                />
                <StyledButton
                        content={"Modifier la carte mentale"}
                        color={"primary"}
                        onClick={navEditCM}
                        width={199}
                        fontSize={1}
                        isHidden={!is_proprio}
                />
                
                <StyledButton
                    content={"Télécharger la carte mentale"}
                    color={"primary"}
                    onClick={handleDownloadImg}
                    width={199}
                    fontSize={1}
                    
                />

    
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
                        isHidden={is_proprio}
                    />
    

    
                    <StyledButton
                        content={"Supprimer la carte mentale"}
                        color={"primary"}
                        onClick={handleDeleteCM}
                        width={200}
                        fontSize={1}
                        isHidden={!is_proprio}
                    />
                
                
            </div>
            <div className='container-voir-cm-image'>
                <h1>{title}</h1>
                <img src={image} alt="Carte mentale" />
            </div>


        </div>
    );
}

export default Voir_CM;
