import { Typography, Box, Popover, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

const actions = [
    { icon: <DeleteIcon />, name: 'Supprimé', action: 'delete' },
    { icon: <EditIcon />, name: 'Editer le titre', action: 'edit' },
];

function ChapitreList({ chapters, editChapterId, nom, isEditing, onEdit, onDelete, onSave, onQuizClick, onCourseClick, errorAnchorEl, errorMessage, open, handleClosePopover, setNom }) {
    return (
        <div className='container-chap-chap-ue-prof'>
            {chapters.length > 0 ? (
                chapters.map((chapter) => (
                    <div className='container-chap-ue-prof' key={chapter.id_chapitre}>
                        <div className='contenant-bouton-chap'>
                            {editChapterId !== chapter.id_chapitre && (
                                <h4>{chapter.label}</h4>
                            )}
                            {editChapterId === chapter.id_chapitre ? (
                                <div className='icon-study' onClick={() => onSave(chapter.id_chapitre)}> 
                                    <SaveIcon />
                                </div>
                            ) : (
                                <div>
                                    <div className='icon-study' onClick={() => onEdit(chapter.id_chapitre)}> 
                                        <EditIcon />
                                    </div>
                                    <div className='icon-study' onClick={() => onDelete(chapter.id_chapitre)}>
                                        <DeleteIcon />
                                    </div>
                                </div>
                            )}
                        </div>
                        {isEditing && editChapterId === chapter.id_chapitre ? (
                            <div className='edit-chapitre-form'>
                                <TextField
                                    fullWidth
                                    label="Nom du chapitre"
                                    variant="outlined"
                                    id='nom'
                                    sx={{
                                        paddingBottom: '10px'
                                    }}
                                    value={nom}
                                    onChange={(e) => setNom(e.target.value)}
                                />   
                                <Popover
                                    open={open}
                                    anchorEl={errorAnchorEl}
                                    onClose={handleClosePopover}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                >
                                    <Typography sx={{ p: 2 }}>{errorMessage}</Typography>
                                </Popover>
                            </div>
                        ) : (
                            <div>
                                <p className="link-style" onClick={() => onQuizClick(chapter.id_chapitre)}>
                                    Quizz du chap {chapter.label}
                                </p>
                                <p className="link-style" onClick={() => onCourseClick(chapter.id_chapitre)}>
                                    Cours du chap {chapter.label}
                                </p>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>Aucun chapitre disponible pour cette UE.</p>
            )}
        </div>
    );
}

export default ChapitreList;
