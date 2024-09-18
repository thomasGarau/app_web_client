import React from 'react';
import { Box, Typography, Checkbox } from '@mui/material';
import Input from '@mui/joy/Input';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Radio, IconButton} from '@mui/joy'

const AnswerContainer = ({
  selected,
  setSelected,
  type,
  validateReponse,
  handleRadioChange,
  addReponse,
  removeReponse,
  id
}) => {
    console.log(type)
  return (
    <div className="answer-container" style={{ height: `${selected.reponses ? selected.reponses.length * 100 + 100 : 83 + 75}px`, overflowY: "auto", maxHeight: "60%" }}>
      <div style={{ display: "flex", flexDirection: "column", width: "70%", padding: "10px 0px" }}>
        {selected.reponses && selected.reponses.map((reponse, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", margin: "15px 0px", justifyContent: "space-between" }}>
            <Input
              placeholder={`Réponse ${index + 1}`}
              onChange={(event) => {
                const updatedReponses = [...selected.reponses];
                updatedReponses[index].contenu = event.target.value;
                setSelected(prevSelected => ({ ...prevSelected, reponses: updatedReponses }));
              }}
              variant="plain"
              sx={{
                color: "black",
                fontSize: { xs: '0.8em', sm: '1.4em', md: '2em' },
                backgroundColor: "#F5F5F5",
                padding: "5px",
                borderRadius: "10px",
                width: "100%",
                '--Input-focusedInset': 'var(--any, )',
                '--Input-focusedThickness': '0.25rem',
                '--Input-focusedHighlight': 'rgba(245,245,245,.25)',
                '&::before': { transition: 'box-shadow .15s ease-in-out' },
                '&:focus-within': { borderColor: '#D9D9D9' },
              }}
              value={reponse.contenu}
            />

            {type === 'multiple' ? (
              <Checkbox
                aria-describedby={id}
                onChange={() => validateReponse(index)}
                checked={reponse.est_bonne_reponse === 1}
                style={{ color: "#F5F5F5" }}
              />
            ) : (
              <Radio
                checked={reponse.est_bonne_reponse === 1}
                onChange={() => handleRadioChange(index)}
                name="radio-buttons"
                style={{ padding: "9px" }}
              />
            )}

            <IconButton onClick={() => removeReponse(index)} className="icon-add" style={{ transition: "0.2s" }}>
              <DeleteIcon style={{ fill: "#f5f5f5" }} />
            </IconButton>
          </div>
        ))}

        {type !== 2 && selected.reponses && selected.reponses.length < 6 && (
          <Box style={{ margin: "10px 5px", display: "flex", alignItems: "center" }}>
            <IconButton onClick={addReponse} className="icon-add" style={{ transition: "0.2s" }}>
              <AddIcon style={{ fill: "#F5F5F5" }} />
            </IconButton>
            <Typography style={{ color: "#F5F5F5", fontSize: "x-large" }}>ajouter une réponse</Typography>
          </Box>
        )}
      </div>
    </div>
  );
};

export default AnswerContainer;
