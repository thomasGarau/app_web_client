import React from 'react';
import { Edit as EditIcon } from '@mui/icons-material';

const TitleEditor = ({ title, isEditing, onEditClick, onTitleChange, onBlur }) => {
    return (
        <div className="titre-carte-mentale">
            {isEditing ? (
                <input
                    type="text"
                    value={title}
                    onChange={onTitleChange}
                    onBlur={onBlur}
                    autoFocus
                />
            ) : (
                <h1>
                    {title}
                    <EditIcon
                        className="edit-icon"
                        onClick={onEditClick}
                        style={{ cursor: 'pointer', marginLeft: '10px' }}
                    />
                </h1>
            )}
        </div>
    );
};

export default TitleEditor;
