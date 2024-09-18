import React from 'react';
import { Input } from '@mui/material';

const QuizzTitleInput = ({ value, onChange, id = 'title-input', placeholder = 'Titre du quizz', ariaDescribedBy }) => {
  return (
    <Input
      aria-describedby={ariaDescribedBy || id}
      onChange={onChange}
      style={{
        width: "80%",
        borderRadius: "0px 0px 10px 10px",
        backgroundColor: "#f5f5f5",
      }}
      id={id}
      placeholder={placeholder}
      variant="plain"
      required
      value={value}
      sx={{ '--Input-focusedThickness': '0rem' }}
    />
  );
};

export default QuizzTitleInput;