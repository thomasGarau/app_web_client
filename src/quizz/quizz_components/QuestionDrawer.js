import React from 'react';
import { Drawer, Button, Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const QuestionsDrawer = ({ open, toggleDrawer, questions, changeQuestion, addQuestion }) => {
    console.log(questions)
    return (
        <Drawer
            PaperProps={{
                style: {
                    width: "250px",
                    backgroundColor: "#133D56",
                },
            }}
            open={open}
            onClose={toggleDrawer(false)}
        >
            <div style={{ backgroundColor: "#133D56" }}>
                {questions.map((question, index) => (
                    <Button
                        key={question.id_question || index}
                        style={{
                            borderBottom: "solid",
                            borderRadius: "0px",
                            height: "73px",
                            color: "#f5f5f5",
                            transition: "0.2s",
                            width: "100%"
                        }}
                        className="button-question"
                        variant="plain"
                        onClick={() => { changeQuestion(question); }}
                    >
                        <span style={{
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "100%",
                            textAlign: "left",
                            paddingLeft: "10px",
                            fontSize: "x-large",
                            overflow: "hidden",
                        }}>
                            {question.label === '' ? "Cliquer ici" : question.label}
                        </span>
                    </Button>
                ))}
                <Box style={{ margin: "10px 5px", display: "flex", alignItems: "center" }}>
                    <IconButton className="icon-add" style={{ transition: "0.2s" }} onClick={addQuestion}>
                        <AddIcon style={{ fill: "#F5F5F5" }} />
                    </IconButton>
                    <Typography style={{ color: "#F5F5F5", fontSize: "x-large" }}>
                        ajouter une question
                    </Typography>
                </Box>
            </div>
        </Drawer>
    );
};

export default QuestionsDrawer;
