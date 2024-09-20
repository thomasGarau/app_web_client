import { Box } from "@mui/material";
import { DeleteModal } from "./DeleteModal";
import StyledButton from "../../composent/StyledBouton";
import ForumButton from "./ForumButton";
import QuizLabel from "./QuizLabel";
import QuizLike from "./QuizLike";
import { useDispatch } from 'react-redux';
import { showForum } from '../../Slice/forumSlice';

export const QuizzItem = ({ quiz, handleOpenDelete, handleDelQuizz, handleCloseDelete, openDelete, navigate, style }) => {
    const dispatch = useDispatch();

    return (
        <Box sx={{ flexWrap: { lg: 'nowrap', xs: 'wrap' }, height: { lg: '120px', xs: '220px' } }} key={quiz.id_quizz} className='container_quizz'>
            <QuizLabel label={quiz.label} />
            <QuizLike note={quiz.note} />
            <StyledButton onClick={() => navigate(`/update_quizz/${quiz.id_quizz}`)} width={200} color={'white'} content={"Modifier"} />
            <ForumButton onClick={() => dispatch(showForum(quiz.id_quizz))} />
            <StyledButton onClick={handleOpenDelete} width={200} color={'white'} content={"Supprimer"} />
            <DeleteModal open={openDelete} handleClose={handleCloseDelete} handleDelQuizz={() => { handleDelQuizz(quiz.id_quizz); handleCloseDelete(); }} style={style} />
        </Box>
    );
};