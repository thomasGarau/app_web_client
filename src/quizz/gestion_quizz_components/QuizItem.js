import { Box } from "@mui/material";
import { DeleteModal } from "./DeleteModal";
import StyledButton from "../../composent/StyledBouton";
import ForumButton from "./ForumButton";
import QuizLabel from "./QuizLabel";
import QuizLike from "./QuizLike";

export const QuizzItem = ({ quiz, handleOpenDelete, handleDelQuizz, handleCloseDelete, openDelete, navigate, style, handleShowForum = null }) => (
    <Box sx={{ flexWrap: { lg: 'nowrap', xs: 'wrap' }, height: { lg: '120px', xs: '220px' } }} key={quiz.id_quizz} className='container_quizz'>
        <QuizLabel label={quiz.label} />
        <QuizLike note={quiz.note} />
        <StyledButton onClick={() => navigate(`/update_quizz/${quiz.id_quizz}`)} width={200} color={'white'} content={"Modifier"} />
        {handleShowForum ?
            <ForumButton onClick={() => handleShowForum(quiz.id_quizz)}/>:
            null
        }
        <StyledButton onClick={handleOpenDelete} width={200} color={'white'} content={"Supprimer"} />
        <DeleteModal open={openDelete} handleClose={handleCloseDelete} handleDelQuizz={() => { handleDelQuizz(quiz.id_quizz); handleCloseDelete(); }} style={style} />
    </Box>
);
