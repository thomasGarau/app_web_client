import { Box, Typography } from "@mui/material";

const QuizLike = ({ note }) => (
    <Box sx={{ height: { md: '75px', sm: '62px', xs: '50px' } }} id='quizz_like' className='quizz_like'>
        <Typography sx={{
            fontSize: { xs: "0.7em", sm: "1em", md: "1.7em" },
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis"
        }}>
            {note}
        </Typography>
        <img className='img_coeur' src={`${process.env.PUBLIC_URL}/star_full.png`} alt='like' />
    </Box>
);

export default QuizLike;
