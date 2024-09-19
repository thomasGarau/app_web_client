import { Box, Typography } from "@mui/material";

const QuizLabel = ({ label }) => (
    <Box sx={{ height: { md: '75px', sm: '62px', xs: '50px' } }} id='quizz_sujet' className='theme_quizz'>
        <Typography sx={{
            fontSize: { xs: "0.7em", sm: "1em", md: "1.7em" },
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis"
        }}>
            {label}
        </Typography>
    </Box>
);

export default QuizLabel;
