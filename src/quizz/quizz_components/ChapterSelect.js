import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ChapterSelect = ({ id = 'select-chapitre', label = 'Chapitre', value, onChange, listChapitre = [] }) => {
  return (
    <FormControl sx={{ width: "300px" }}>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        sx={{
          width: "100%",
          borderRadius: "10px",
          backgroundColor: "#f0f0f0"
        }}
        labelId={`${id}-label`}
        id={id}
        value={value}
        label={label}
        onChange={onChange}
      >
        {listChapitre.length > 0 && listChapitre.map((chap, index) => (
          <MenuItem key={index} value={chap}>{chap.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ChapterSelect;
