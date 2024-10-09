import { Box, FormControl, InputLabel, MenuItem, Modal, Select, Typography } from "@mui/material";
import StyledButton from "../../composent/StyledBouton";
import PopoverError from "../../composent/PopoverError";

export const CreateModal = ({ open, handleClose, UE, listUE, handleChangeUE, handleToCreateQuizz, idEl, openAnchor, handleClosePopover, errorMessage, errorAnchorEl, style }) => (
  <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Choisissez une UE
      </Typography>
      <FormControl className="profile-select" sx={{ m: 1, width: "60%", alignItems: "center" }}>
        <InputLabel id="label-ue">UE</InputLabel>
        <Select sx={{ width: "100%", borderRadius: "10px", backgroundColor: "#f0f0f0" }} labelId="label-ue" id="demo-simple-select" value={UE} label="UE" onChange={handleChangeUE}>
          {listUE && listUE.map((ue, index) => (
            <MenuItem key={index} value={ue}>
              {ue.label}
            </MenuItem>
          ))}
        </Select>
        <StyledButton content={"Créer le quizz"} width={"90%"} color={"primary"} onClick={handleToCreateQuizz} />
      </FormControl>
      <PopoverError
        id={idEl}
        open={openAnchor}
        anchorEl={errorAnchorEl}
        onClose={handleClosePopover}
        errorMessage={errorMessage}
      />
    </Box>
  </Modal>
);
