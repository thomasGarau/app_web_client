import React from 'react';
import { useState, useEffect } from "react";
import IsoIcon from '@mui/icons-material/Iso';
import CheckIcon from '@mui/icons-material/Check';
import QuizIcon from '@mui/icons-material/Quiz';
import ExposureIcon from '@mui/icons-material/Exposure';
import { Button, Radio, IconButton, RadioGroup } from '@mui/joy'
import { Box, useMediaQuery  } from "@mui/material";
import "../CreateQuizz.css";

const AnswerOptions = ({ type, handleTypeChange, validateQuizz, toggleDrawer, estNegatif, setEstNegatif, children }) => {
  const isMobile = useMediaQuery('(max-width: 890px)');


  return (
    <>
      {isMobile ? (
        <>
          <RadioGroup
            name="radio-buttons-group"
            value={type || 'multiple'}
            onClick={console.log}
            onChange={(event) => handleTypeChange(event.target.value)}
            style={{ position: "fixed", left: "3%", bottom: "12.5%" }}
          >
            <Radio
              size="lg"
              value={'multiple'}
              label="M"
              checked={type === 'multiple'}
            />
            <Radio
              size="lg"
              value={'seul'}
              label="U"
              checked={type === 'seul'}
            />
            <Radio
              size="lg"
              value={'vrais'}
              label="V"
              checked={type === 'vrais'}
            />
            <Radio
              size="lg"
              value={'faux'}
              label="F"
              checked={type === 'faux'}
            />
          </RadioGroup>

          <IconButton
            onClick={validateQuizz}
            sx={{
              color: "black",
              fontSize: "large",
              backgroundColor: "rgb(245 245 245)",
              padding: "10px",
              borderRadius: "20px",
              margin: "10px 0px",
              position: "fixed",
              bottom: "5%",
              right: "1%",
              transitionDuration: '0.4s',
              '&:hover': {
                boxShadow: '0 12px 16px 0 rgba(0,0,0,0.4), 0 17px 50px 0 rgba(0,0,0,0.3)',
                backgroundColor: 'rgb(245, 245, 245)',
              },
            }}
          ><CheckIcon />
          </IconButton>
          <IconButton style={{
            position: "fixed",
            left: "3%",
            bottom: "5%",
            color: "black",
            fontSize: "large",
            backgroundColor: "rgb(245 245 245)",
            padding: "10px",
            borderRadius: "20px"
          }}
            onClick={toggleDrawer(true)}>
            <QuizIcon /></IconButton>
          <IconButton sx={{
            color: "black",
            fontSize: "large",
            backgroundColor: "rgb(245 245 245)",
            padding: "10px",
            borderRadius: "20px",
            position: "fixed",
            bottom: "12.5%",
            right: "3%"
          }}
            onClick={() => setEstNegatif(!estNegatif)}>{estNegatif ? <ExposureIcon /> : <IsoIcon />}</IconButton>
        </>
      ) : (
        <>
          <Box sx={{
            position: "fixed",
            left: "1%",
            bottom: "5%",
            display: "flex",
            flexDirection: "column-reverse",
            alignItems: "center"
          }}>
            <RadioGroup
              name="radio-buttons-group"
              value={type || 'multiple'}
              onChange={(event) => handleTypeChange(event.target.value)}
              sx={{ margin: "10px 0px" }}
            >
              <Radio
                size="lg"
                value={'multiple'}

                label="Choix Multiple"
                checked={type === 'multiple'}
              />
              <Radio
                size="lg"
                value={'seul'}
                label="Choix Unique"
                checked={type === 'seul'}
              />
              <Radio
                size="lg"
                value={'vrais'}
                label="Vrai"
                checked={type === 'vrais'}
              />
              <Radio
                size="lg"
                value={'faux'}
                label="Faux"
                checked={type === 'faux'}
              />
            </RadioGroup>
            <Button sx={{
              color: "black",
              fontSize: "large",
              backgroundColor: "rgb(245 245 245)",
              padding: "10px",
              borderRadius: "20px",
              transitionDuration: '0.4s',
              '&:hover': {
                boxShadow: '0 12px 16px 0 rgba(0,0,0,0.4), 0 17px 50px 0 rgba(0,0,0,0.3)',
                backgroundColor: 'rgb(245, 245, 245)',
              },
            }}
              onClick={toggleDrawer(true)}>Menu des questions</Button>
          </Box>

          <Box sx={{
            position: "fixed",
            bottom: "5%",
            right: "1%",
            display: "flex",
            flexDirection: "column",
          }}>
            <Button
              onClick={validateQuizz}
              sx={{
                color: "black",
                fontSize: "large",
                backgroundColor: "rgb(245 245 245)",
                padding: "10px",
                borderRadius: "20px",
                margin: "10px 0px",
                transitionDuration: '0.4s',
                '&:hover': {
                  boxShadow: '0 12px 16px 0 rgba(0,0,0,0.4), 0 17px 50px 0 rgba(0,0,0,0.3)',
                  backgroundColor: 'rgb(245, 245, 245)',
                },
              }}
            >
              Valider le quizz
            </Button>
            <Button
              sx={{
                color: "black",
                fontSize: "large",
                backgroundColor: "rgb(245, 245, 245)",
                padding: "10px",
                borderRadius: "20px",
                transitionDuration: '0.4s',
                '&:hover': {
                  boxShadow: '0 12px 16px 0 rgba(0,0,0,0.4), 0 17px 50px 0 rgba(0,0,0,0.3)',
                  backgroundColor: 'rgb(245, 245, 245)',
                },
              }}
              onClick={() => setEstNegatif(!estNegatif)}
            >
              {estNegatif ? "Negatif" : "Normal"} {estNegatif ? <ExposureIcon /> : <IsoIcon />}
            </Button>
            {/** Tous les composants supplémentaires enfant remplacerons children */}
            {children}
          </Box>
        </>
      )}
    </>
  );
};

export default AnswerOptions;
