import { Box, Button, Input, Typography } from "@mui/material";
import IconButton from '@mui/joy/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Header from "../composent/Header";
import "./CreateQuizz.css";
import { useState } from "react";

function CreateQuizz() {

    const [questions, setQuestions] = useState([{ title: "Premiere question", reponses: ["un truc", "un machin", "une chose"] }]);
    const [selected, setSelected] = useState(questions[0]);

    return (
        <div style={{ height: "100vh"}}>
            <Header></Header>
            <div className="container-create-quizz" style={{ display:"flex"}}>
                <nav className="nav-question">
                    <Input id="title-input" placeholder="Titre du quizz" variant="plain" required></Input>
                    {questions.map(question => (
                        <Button
                            style={{ fontFamily: "Nanum Pen Script", fontSize: "x-large", borderBottom: "solid", borderRadius: "0px", color: "white" }}
                            key={question.title}
                            onClick={() => setSelected(question)}>
                            {question.title}
                        </Button>

                    ))}
                    <Box style={{ margin: "10px 5px", display: "flex", alignItems: "center" }}>
                        <IconButton><AddIcon style={{ fill: "white" }} /></IconButton>
                        <Typography style={{ color: "white", fontFamily: "Nanum Pen Script", fontSize: "x-large" }}>ajouter un question</Typography>
                    </Box>

                </nav>
                <div className="background-create-quizz">
                </div>
            </div>
        </div>
    )
}

export default CreateQuizz;
