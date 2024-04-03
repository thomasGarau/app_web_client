import { Box, Button, Checkbox, Input, Typography } from "@mui/material";
import IconButton from '@mui/joy/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Header from "../composent/Header";
import "./CreateQuizz.css";
import { useState } from "react";

function CreateQuizz() {

    const [questions, setQuestions] = useState([{ title: "Premiere question", reponses: ["un truc", "un machin", "une chose"] }]);
    const [selected, setSelected] = useState(questions[0]);

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    return (
        <div style={{ height: "100vh" }}>
            <Header></Header>
            <div className="container-create-quizz" style={{ display: "flex" }}>
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
                    <div className="answer-container">
                        <Typography style={{ color: "white", fontFamily: "Nanum Pen Script", fontSize: "xx-large", marginTop: "10px" }}>{selected.title}</Typography>
                        <div style={{ display: "flex", flexDirection: "column", width:"70%" }}>
                            {selected.reponses.map((reponse, index) => (
                                <div key={index} style={{ display: "flex", alignItems: "center", margin: "15px 0px" }}>
                                    <Input
                                        placeholder={"Reponse " + (index + 1)}
                                        style={{ color: "black", fontFamily: "Nanum Pen Script", fontSize: "x-large", backgroundColor: "white", padding: "5px", borderRadius: "10px", width: "100%" }}
                                        value={reponse}
                                    />
                                    <Checkbox {...label} style={{ color:"white"}}/>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button
                        style={{ color: "white", fontFamily: "Nanum Pen Script", fontSize: "large", backgroundColor: "#133D56", padding: "10px", borderRadius: "20px", position: "absolute", bottom:"5%", right:"5%" }}>
                        Valider le quizz
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CreateQuizz;
