import React from 'react';
import { Handle } from 'reactflow';

const CustomNode = ({ data, id, isConnectable, onClick }) => {
    return (
        <div
            className="custom-node"
            onClick={() => onClick(id)}
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
                style={{
                    background: '#555',
                    width: '5px', // Ajuste la largeur
                    height: '5px', // Ajuste la hauteur
                    borderRadius: '50%', // Assure une forme circulaire
                }}
            />
            <Handle
                type="source"
                position="bottom"
                isConnectable={isConnectable}
                style={{
                    background: '#555',
                    width: '5px', // Ajuste la largeur
                    height: '5px', // Ajuste la hauteur
                    borderRadius: '50%', // Assure une forme circulaire
                }}
            />

        </div>
    );
};

export default CustomNode;
