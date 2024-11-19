import React, { useState, useEffect } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    Handle,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './composents/CustomNode';

function Voir_CM() {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [title, setTitle] = useState('');

    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/mindMap3.json`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement du fichier JSON');
                }
                return response.json();
            })
            .then((data) => {
                // Mettre à jour le titre
                setTitle(data.title || 'Carte Mentale');

                // Mapper les nœuds pour inclure la structure React Flow
                const adaptedNodes = data.nodes.map((node) => ({
                    id: node.id,
                    type: 'custom', // Utilisation du type personnalisé
                    data: {
                        label: node.label,
                        color: node.color,
                    },
                    position: node.position,
                }));

                setNodes(adaptedNodes);
                setEdges(data.edges || []);
            })
            .catch((error) => {
                console.error('Erreur:', error);
            });
    }, []);

    const nodeTypes = { custom: CustomNode }; // Déclaration des nœuds personnalisés

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <h1>{title}</h1>
            <div style={{ height: '70vh', width: '80%' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    fitView
                    nodeTypes={nodeTypes} // Inclure les types personnalisés
                >
                    <MiniMap />
                    <Controls />
                    <Background color="#aaa" gap={16} />
                </ReactFlow>
            </div>
        </div>
    );
}

export default Voir_CM;
