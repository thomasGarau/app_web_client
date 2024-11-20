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
import { useParams } from 'react-router-dom';

function Voir_CM() {
    const {id_CM} = useParams();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

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


    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <h1>{title}</h1>
            <div style={{ height: '70vh', width: '80%' }}>
                <img src={image} alt="Carte mentale" style={{ width: '50%'}} />
            </div>
        </div>
    );
}

export default Voir_CM;
