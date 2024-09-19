import { Typography } from "@mui/material";
import { QuizzItem } from "./QuizItem";

export const QuizList = ({ quizzes, navigate, handleOpenDelete, handleDelQuizz, handleCloseDelete, openDelete, style, handleShowForum = null }) => (
    <div className='container_quizzs'>
      {quizzes ? (
        quizzes.length > 0 ? (
          quizzes.map(quiz => (
            <QuizzItem
              key={quiz.id_quizz}
              quiz={quiz}
              navigate={navigate}
              handleOpenDelete={handleOpenDelete}
              handleDelQuizz={handleDelQuizz}
              handleCloseDelete={handleCloseDelete}
              openDelete={openDelete}
              style={style}
              handleShowForum={handleShowForum}
            />
          ))
        ) : <Typography>Aucun quizz disponible.</Typography>
      ) : <Typography>Aucun quizz disponible</Typography>}
    </div>
  );
  