import { Typography, Box, Popover, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import ExpandableChapter from './ExpandableChapter';

const actions = [
    { icon: <DeleteIcon />, name: 'Supprimé', action: 'delete' },
    { icon: <EditIcon />, name: 'Editer le titre', action: 'edit' },
];

function ChapitreList({ chapters, editChapterId, nom, isEditing, onEdit, onDelete, onSave, onQuizClick, onFlashcardsClick, onCourseClick, errorAnchorEl, errorMessage, open, handleClosePopover, setNom }) {
    return (
        <div className='container-chap-chap-ue-prof'>
            {chapters.length > 0 ? (
                chapters.map((chapter) => (
                    <ExpandableChapter
                        key={chapter.id_chapitre}
                        chapter={chapter}
                        editChapterId={editChapterId}
                        isEditing={isEditing}
                        nom={nom}
                        setNom={setNom}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onSave={onSave}
                        onQuizClick={onQuizClick}
                        onCourseClick={onCourseClick}
                        onFlashcardsClick={onFlashcardsClick}
                    />
                ))
            ) : (
                <Typography>Aucun chapitre disponible</Typography>
            )}
        </div>
    );
}

export default ChapitreList;
