import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
    Background,
    useEdgesState,
    useNodesState,
    Handle,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './Carte_mentale.css';
import { Edit as EditIcon } from '@mui/icons-material';

const CustomNode = ({ data, id, isConnectable, onClick }) => {
    return (
        <div
            className="custom-node"
            onClick={() => onClick(id)} // Sélectionne le nœud
            style={{
                padding: '10px',
                borderRadius: '5px',
                backgroundColor: data.color || '#ffffff',
                border: '1px solid #ccc',
                textAlign: 'center',
                cursor: 'pointer',
            }}
        >
            <input
                type="text"
                value={data.label}
                onChange={(e) => data.onLabelChange(e.target.value, id)}
                style={{
                    border: 'none',
                    padding: '5px',
                    borderRadius: '4px',
                    textAlign: 'center',
                    backgroundColor: 'transparent',
                    color: '#000',
                }}
            />
            <Handle
                type="target"
                position="top"
                isConnectable={isConnectable}
                style={{ background: '#555' }}
            />
            <Handle
                type="source"
                position="bottom"
                isConnectable={isConnectable}
                style={{ background: '#555' }}
            />
        </div>
    );
};

export default function Create_CM() {
    const [title, setTitle] = useState('Nouvelle carte mentale');
    const [isEditing, setIsEditing] = useState(false);
    const [nodeIdCounter, setNodeIdCounter] = useState(2);
    const [selectedNodeId, setSelectedNodeId] = useState(null); // ID du nœud sélectionné
    const [selectedColor, setSelectedColor] = useState('#ffffff');

    const [nodes, setNodes, onNodesChange] = useNodesState([
        {
            id: '1',
            type: 'custom',
            data: {
                label: 'Idée principale',
                color: '#ffffff',
                onLabelChange: handleNodeLabelChange,
            },
            position: { x: 250, y: 5 },
        },
    ]);

    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

    const handleAddNode = () => {
        const newNodeId = `${nodeIdCounter}`;
        const newNode = {
            id: newNodeId,
            type: 'custom',
            data: {
                label: `Nouvelle idée ${nodeIdCounter}`,
                color: '#ffffff',
                onLabelChange: handleNodeLabelChange,
            },
            position: { x: Math.random() * 400, y: Math.random() * 400 },
        };
        setNodes((nds) => [...nds, newNode]);
        setNodeIdCounter((count) => count + 1);
    };

    

    const handleNodeClick = (nodeId) => {
        // Trouve le nœud correspondant dans la liste
        const node = nodes.find((n) => n.id === nodeId);
    
        // Vérifie si le nœud existe
        if (!node) {
            console.error(`Node with ID ${nodeId} not found.`);
            return;
        }
    
        // Met à jour la couleur sélectionnée avec celle du nœud cliqué
        setSelectedNodeId(nodeId);
        setSelectedColor(node.data.color || '#ffffff'); // Utilise une couleur par défaut si nécessaire
    };
    

    const handleNodeColorChange = (color) => {
        setSelectedColor(color); // Met à jour la couleur sélectionnée
        if (selectedNodeId) {
            setNodes((nds) =>
                nds.map((node) =>
                    node.id === selectedNodeId ? { ...node, data: { ...node.data, color } } : node
                )
            );
        }
    };

    function handleNodeLabelChange(newLabel, nodeId) {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
            )
        );
    }

    const handleSave = () => {
        const mentalMap = {
            title,
            nodes: nodes.map(({ id, type, data, position }) => ({
                id,
                type,
                label: data.label,
                color: data.color,
                position,
            })),
            edges: edges.map(({ id, source, target, sourceHandle, targetHandle }) => ({
                id,
                source,
                target,
                sourceHandle,
                targetHandle,
            })),
        };

        const mentalMapJSON = JSON.stringify(mentalMap, null, 2);

        // Télécharger le JSON ou l'afficher dans la console
        console.log(mentalMapJSON);

        const blob = new Blob([mentalMapJSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const nodeTypes = useMemo(
        () => ({
            custom: (props) => <CustomNode {...props} onClick={handleNodeClick} />,
        }),
        [selectedColor]
    );

    return (
        <div className="container-create-cm" style={{ display: 'flex', flexDirection: 'row', width: '100%'  }}>
            {/* Palette de couleurs */}
            <div className="palette-container" style={{ display:'flex', flexDirection:"column", width:'20%', height:'100%', justifyContent:'center', margin :'20px' }}>
                <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => handleNodeColorChange(e.target.value)}
                    style={{
                        width: '100%',
                        height: '40px',
                        cursor: 'pointer',
                        border: 'none',
                    }}
                />
                <button
                    style={{
                        margin: '10px 0',
                        padding: '10px 20px',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                    onClick={handleAddNode}
                >
                    Ajouter une idée
                </button>
                <button
                    style={{
                        margin: '10px 0',
                        padding: '10px 20px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                    onClick={handleSave}
                >
                    Enregistrer
                </button>
            </div>
            {/* Contenu principal */}
            <div style={{ height: '100%', width: '100%', display:"flex", flexDirection:"column", alignItems:'center' }}>
                <div className="titre-carte-mentale">
                    {isEditing ? (
                        <input
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            onBlur={handleBlur}
                            autoFocus
                        />
                    ) : (
                        <h1>
                            {title}
                            <EditIcon
                                className="edit-icon"
                                onClick={handleEditClick}
                                style={{ cursor: 'pointer', marginLeft: '10px' }}
                            />
                        </h1>
                    )}
                </div>
                <div className="reactflow-container" style={{ height: '70%', width: '70%' }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        fitView
                    >
                        <MiniMap />
                        <Controls />
                        <Background color="#aaa" gap={16} />
                    </ReactFlow>
                </div>
            </div>
        </div>
    );
}
