import React from 'react';

const NodeControls = ({ selectedColor, onColorChange, onAddNode, onSave }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '20%',
                justifyContent: 'center',
                margin: '20px',
            }}
        >
            <input
                type="color"
                value={selectedColor}
                onChange={(e) => onColorChange(e.target.value)}
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
                onClick={onAddNode}
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
                onClick={onSave}
            >
                Enregistrer
            </button>
        </div>
    );
};

export default NodeControls;
