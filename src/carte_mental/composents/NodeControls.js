import React from 'react';
import StyledButton from '../../composent/StyledBouton';
import '../Carte_mentale.css';

const NodeControls = ({ selectedColor, onColorChange, onAddNode, onSave, handleDeleteSelected }) => {
    return (
        <div className='node-controls-cm'>
            <input
                type="color"
                value={selectedColor}
                onChange={(e) => onColorChange(e.target.value)}
                style={{
                    width: '200px',
                    height: '60px',
                    cursor: 'pointer',
                    border: 'none',
                    padding : "0 10px",
                    margin : " 0 10px",
                }}
            />
            <StyledButton
                content={"Ajouter une idée"}
                color={"primary"}
                width={"200"}
                onClick={onAddNode}
            />
            <StyledButton
                content={"Enregistrer"}
                color={"primary"}
                onClick={onSave}
                width={"200"}
            />

            <StyledButton
                content={"Supprimer"}
                color={"danger"}
                onClick={handleDeleteSelected}
                width={"200"}
            />

        </div>
    );
};

export default NodeControls;
