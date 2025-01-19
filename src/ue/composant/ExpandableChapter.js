import React, { useState } from "react";
import { Card, CardContent, Typography, TextField, IconButton, SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import QuizIcon from '@mui/icons-material/Quiz';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CardMembershipTwoToneIcon from '@mui/icons-material/CardMembershipTwoTone';
import "./ExpandableChapter.css";

const ExpandableChapter = ({
    chapter,
    editChapterId,
    nom,
    setNom,
    onEdit,
    onDelete,
    onSave,
    onQuizClick,
    onCourseClick,
    onFlashcardsClick
}) => {
    const [open, setOpen] = useState(false);

    const actions = editChapterId === chapter.id_chapitre 
    ? [
        { icon: <SaveIcon />, name: 'Sauvegarder', onClick: () => onSave(chapter.id_chapitre) }
      ]
    : [
        { icon: <QuizIcon />, name: 'Quiz', onClick: () => onQuizClick(chapter.id_chapitre) },
        { icon: <MenuBookIcon />, name: 'Cours', onClick: () => onCourseClick(chapter.id_chapitre) },
        { icon: <CardMembershipTwoToneIcon />, name: 'Flashcards', onClick: () => onFlashcardsClick(chapter.id_chapitre) },
        { icon: <EditIcon />, name: 'Éditer', onClick: () => onEdit(chapter.id_chapitre) },
        { icon: <DeleteIcon />, name: 'Supprimer', onClick: () => onDelete(chapter.id_chapitre) },
        
      ];

    return (
        <div className="card-container">
            <Card
                className="card"
                sx={{
                    position: 'relative',
                    padding: 2,
                    transition: 'all 0.3s ease'
                }}
            >
                <CardContent>
                    {editChapterId === chapter.id_chapitre ? (
                        <TextField
                            fullWidth
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <Typography variant="h6">{chapter.label}</Typography>
                    )}
                </CardContent>
            </Card>

            <SpeedDial
                ariaLabel="Chapter actions"
                sx={{
                    position: 'absolute',
                    bottom: -16,
                    right: 16,
                    '& .MuiFab-primary': { width: 40, height: 40 },
                    '& .MuiSpeedDialAction-fab': { width: 30, height: 30 }
                }}
                icon={<SpeedDialIcon />}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                direction="left"
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={(e) => {
                            e.stopPropagation();
                            action.onClick();
                        }}
                    />
                ))}
            </SpeedDial>
        </div>
    );
};

export default ExpandableChapter;