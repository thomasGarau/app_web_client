import { Badge, Box, Modal, Typography } from "@mui/material";
import { PickersDay } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
  };

function ServerDay(props) {
    const { highlightedDays = [], listJMethod = [], day, outsideCurrentMonth, ...other } = props;
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
      setOpen(true);
    }
    const handleClose = () => setOpen(false);
    const [isSelected, setIsSelected] = useState(false);
    const [JMethod, setJMethod] = useState();
  
  
    useEffect(() => {
      setIsSelected(!outsideCurrentMonth && highlightedDays.includes(day.$D));
      setJMethod(listJMethod.filter(JMethod => highlightedDays.includes(new Date(JMethod.date).getDate())));
    }, [listJMethod, outsideCurrentMonth, highlightedDays, day.$D]);
  
  
    return (
      <Badge
        key={day.toString()}
        overlap="circular"
        badgeContent={isSelected ? '🌚' : undefined}
      >
        <PickersDay
          onClick={isSelected ? handleOpen : null}
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
        />
        {isSelected && (
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              {JMethod.map((item, index) => (
                <Typography sx={{padding: "5px"}} key={index} id="modal-modal-title" variant="h6" component="h2">
                  {`Chapitre: ${item.label} à réviser !`}
                </Typography>
              ))}
            </Box>
          </Modal>
        )}
      </Badge>
    );
  }

  export default ServerDay;