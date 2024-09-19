import { Box, Modal, Typography } from "@mui/material";
import StyledButton from "../../composent/StyledBouton";

export const DeleteModal = ({ open, handleClose, handleDelQuizz, style }) => (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Voulez-vous vraiment supprimer le quizz?
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
          <StyledButton onClick={handleDelQuizz} width={100} color={'primary'} content={"Oui"} />
          <StyledButton onClick={handleClose} width={100} color={'primary'} content={"Non"} />
        </Box>
      </Box>
    </Modal>
  );
  