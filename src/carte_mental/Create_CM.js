import React, { useState, useCallback, useMemo, useRef } from 'react';
import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
    Background,
    useEdgesState,
    useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './Carte_mentale.css';
import NodeControls from './composents/NodeControls';
import TitleEditor from './composents/TitleEditor';
import CustomNode from './composents/CustomNode';
import { toPng } from 'html-to-image';

export default function Create_CM() {
    const [title, setTitle] = useState('Nouvelle carte mentale');
    const [isEditing, setIsEditing] = useState(false);
    const [nodeIdCounter, setNodeIdCounter] = useState(2);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [selectedColor, setSelectedColor] = useState('#ffffff');
    const [showMiniMap, setShowMiniMap] = useState(true);
    const [showControls, setShowControls] = useState(true);

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
    const reactFlowWrapper = useRef(null);

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
        setNodes((currentNodes) => {
            const node = currentNodes.find((n) => n.id === nodeId);
            if (!node) {
                console.error(`Node with ID ${nodeId} not found.`);
                return currentNodes;
            }
            setSelectedNodeId(nodeId);
            setSelectedColor(node.data.color || '#ffffff');
            return currentNodes;
        });
    };
    

    const handleNodeColorChange = (color) => {
        setSelectedColor(color);
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

        // Télécharger le JSON
        const blob = new Blob([mentalMapJSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title}.json`;
        link.click();
        URL.revokeObjectURL(url);

        // Enregistrer la carte mentale comme image
        if (reactFlowWrapper.current) {
            setShowMiniMap(false);
            setShowControls(false);
            setTimeout(() => {
                toPng(reactFlowWrapper.current)
                    .then((dataUrl) => {
                        const imgLink = document.createElement('a');
                        imgLink.href = dataUrl;
                        imgLink.download = `${title}.png`;
                        imgLink.click();
                        setShowMiniMap(true);
                        setShowControls(true);
                    })
                    .catch((err) => {
                        console.error('Erreur lors de la capture de l\'image:', err);
                        setShowMiniMap(true);
                        setShowControls(true);
                    });
            }, 100);
        }
    };

    const nodeTypes = useMemo(
        () => ({
            custom: (props) => <CustomNode {...props} onClick={handleNodeClick} />,
        }),
        [selectedColor]
    );

    

    return (
        <div className="container-create-cm" style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <NodeControls
                selectedColor={selectedColor}
                onColorChange={handleNodeColorChange}
                onAddNode={handleAddNode}
                onSave={handleSave}
            />
            <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <TitleEditor
                    title={title}
                    isEditing={isEditing}
                    onEditClick={handleEditClick}
                    onTitleChange={handleTitleChange}
                    onBlur={handleBlur}
                />
                <div
                    ref={reactFlowWrapper}
                    className="reactflow-container"
                    style={{ height: '70%', width: '70%', backgroundColor: '#ffffff' }}
                >
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        fitView
                    >
                        {showMiniMap && <MiniMap />}
                        {showControls && <Controls />}
                    </ReactFlow>
                </div>
            </div>
        </div>
    );
}
