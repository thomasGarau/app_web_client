import { Popover, Typography } from "@mui/material";

const PopoverError = ({ id, open, anchorEl, onClose, errorMessage }) => (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
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
  );
  
  export default PopoverError;
  