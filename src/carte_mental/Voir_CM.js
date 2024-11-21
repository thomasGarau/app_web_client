import React, { useState, useEffect, useMemo } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './composents/CustomNode';
import { useParams, useNavigate } from "react-router-dom";
import StyledButton from '../composent/StyledBouton';


function Voir_CM() {
    const {id_CM} = useParams();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);
    const [imgUrl, setImgUrl] = useState('https://res.cloudinary.com/dcyjnrgxh/image/upload/v1715891093/image-ue/on8waw6k2tptixnavlbb.png');
    const navigate = useNavigate();

    useEffect(() => {
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
                setTitle(details.title || 'Carte Mentale');
                setImage(details.image || `${process.env.PUBLIC_URL}/cartementale.png`);
            })
            .catch((error) => {
                console.error('Erreur:', error);
            });
    }, []);

    function navEditCM() {
        navigate(`/edit_carte_mentale/${id_CM}`);
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
                <StyledButton
                        content={"Modifier la carte mentale"}
                        color={"primary"}
                        onClick={navEditCM}
                        width={199}
                        fontSize={"1em"}
                />
                <StyledButton
                    content={"Télécharger la carte mentale"}
                    color={"primary"}
                    onClick={handleDownloadImg}
                    width={199}
                    fontSize={"1em"}
                    
                />
            </div>
            <div className='container-voir-cm-image'>
                <h1>{title}</h1>
                <img src='https://coccibel.fr/wp-content/uploads/2023/09/carteMentale-couv.png' alt="Carte mentale" style={{ width: '50%'}} />
            </div>
        </div>
    );
}

export default Voir_CM;
