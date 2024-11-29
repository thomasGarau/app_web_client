import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
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
import { toBlob } from 'html-to-image';
import LockSwitch from './composents/LockSwitch';

import {createCM, getCmDetails} from '../API/CmAPI';
import StyledButton from '../composent/StyledBouton';
import { set } from 'date-fns';

export default function Edit_CM() {
    const { id_chap, id_CM } = useParams();
    const navigate = useNavigate();
    const [titre, settitre] = useState('Nouvelle carte mentale');
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [nodeIdCounter, setNodeIdCounter] = useState(2);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [selectedColor, setSelectedColor] = useState('#ffffff');
    const [showMiniMap, setShowMiniMap] = useState(true);
    const [showControls, setShowControls] = useState(true);
    const [isLocked, setIsLocked] = useState(null);
    const reactFlowWrapper = useRef(null);

    useEffect(() => {
        if (id_CM) {
            const res = getCmDetails(id_CM);
                res.then((data) => {
                    console.log('Données de la carte mentale:', data);
                    const details = data.details || {};
                    settitre(details.titre || 'Carte mentale');
                    const newIsLocked = data.visibilite === 'public' ? true : false;
                    setIsLocked(newIsLocked);

                    setNodes(
                        details.nodes.map((node) => ({
                            id: node.id,
                            type: node.type || 'default',
                            data: {
                                label: node.label,
                                color: node.color,
                                onLabelChange: handleNodeLabelChange,
                            },
                            position: node.position,
                        }))
                    );
                    setEdges(details.edges || []);
                    setNodeIdCounter(details.nodes.length + 1);
                })
                .catch((error) => {
                    console.error('Erreur lors du chargement de la carte mentale:', error);
                });
        } else if (id_chap) {
            // Initialiser une nouvelle carte mentale
            settitre('Nouvelle carte mentale');
            setIsLocked(true);
            setNodes([
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
            setEdges([]);
            setNodeIdCounter(2);
        } else {
            console.error('Erreur: ID du chapitre ou de la carte mentale non spécifié.');
        }
    }, [id_CM]);



    const handleNodeLabelChange = (newLabel, nodeId) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
            )
        );
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

    const handleSave = async () => {
        const mentalMap = {
            titre,
            visibilite: isLocked ? 'public' : 'prive',
            chapitre: id_chap,
            details: {
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
            },
        };
    
        const mentalMapJSON = JSON.stringify(mentalMap, null, 2);
    
        if (reactFlowWrapper.current) {
            setShowMiniMap(false);
            setShowControls(false);
    
            try {
                const blob = await toBlob(reactFlowWrapper.current, { quality: 0.8 });
                console.log('Image blob:', blob);
                if(!id_CM) {
                await createCM(mentalMapJSON, blob);
                console.log('Carte mentale créée avec succès');
                navigate('/carte_mentale/' + id_chap);
                } else {
                    console.log('Modification de la carte mentale');
                }
                
            } catch (error) {
                console.error("Erreur lors de la capture ou de l'envoi des données:", error);
            } finally {
                setShowMiniMap(true);
                setShowControls(true);
            }
        } else {
            console.error("L'élément reactFlowWrapper est introuvable.");
        }
    };
    

    const nodeTypes = useMemo(
        () => ({
            custom: (props) => <CustomNode {...props} onClick={handleNodeClick} />,
        }),
        [selectedColor]
    );


      function handleSwitchChange () {
        setIsLocked(!isLocked);
      };

      function handleRetour()  {
        navigate('/carte_mentale/' + id_chap);
      }


    return (
        <div className="container-create-cm" >
            <div  className='container-create-cm-left'>
                <StyledButton
                    content={"Retour"}
                    color={"primary"}
                    onClick={handleRetour}
                    width={"200"}
                />
                <NodeControls
                    selectedColor={selectedColor}
                    onColorChange={handleNodeColorChange}
                    onAddNode={handleAddNode}
                    onSave={handleSave}
                />
                <LockSwitch isLocked={isLocked} onChange={handleSwitchChange} />
            </div>
            <div className='container-edit-title' >
                <TitleEditor
                    title={titre}
                    isEditing={isEditing}
                    onEditClick={() => setIsEditing(true)}
                    onTitleChange={(e) => settitre(e.target.value)}
                    onBlur={() => setIsEditing(false)}
                />
                <div
                    ref={reactFlowWrapper}
                    className="reactflow-container"
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
