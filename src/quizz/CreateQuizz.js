import { useState, useEffect } from "react";
import { Box, Checkbox, Typography } from "@mui/material";
import IconButton from '@mui/joy/IconButton';
import Textarea from '@mui/joy/Textarea';
import Input from '@mui/joy/Input';
import Radio from '@mui/joy/Radio';
import Button from '@mui/joy/Button';
import RadioGroup from '@mui/joy/RadioGroup';
import AddIcon from '@mui/icons-material/Add';
import Header from "../composent/Header";
import "./CreateQuizz.css";

function CreateQuizz() {
    const [questions, setQuestions] = useState([{ index: 0, title: "Premiere question", type: 0, reponses: ["un truc", "un machin", "une chose"], correct: [] }]);
    const [selected, setSelected] = useState(questions[0]);
    const [title, setTitle] = useState("");
    const [reponses, setReponses] = useState(questions[0].reponses);
    const [type, setType] = useState(selected.type)
    const [checkedAnswers, setCheckedAnswers] = useState(Array(selected.reponses.length).fill(false));
    const [radioCheck, setRadioCheck] = useState(0)

    const addQuestion = () => {
        setQuestions(prevQuestions => [...prevQuestions, { index: questions.length, title: "", type: 0, reponses: ["", "", ""], correct: [] }]);
    };

    const addReponse = () => {
        const newReponses = [...reponses, ""];
        setReponses(newReponses);

        setQuestions(prevQuestions => {
            return prevQuestions.map(question => {
                if (question.index === selected.index) {
                    return { ...question, reponses: newReponses };
                }
                return question;
            });
        });

        setSelected(prevSelected => {
            return { ...prevSelected, reponses: newReponses };
        });
        let tab = [];
        selected.reponses.forEach((reponse, index) => {
            if (selected.correct.includes(index)) {
                tab.push(true);
            } else {
                tab.push(false);
            }
        });
        setCheckedAnswers(tab);
    };

    const validateQuizz = () => {
        //requête ici
        //Puis navigate vers un page approprié
    }

    const validateReponse = (indexReponse) => {
        setQuestions(prevQuestions => {
            return prevQuestions.map(question => {
                if (question.index === selected.index) {
                    if (question.correct.includes(indexReponse)) {
                        return { ...question, correct: question.correct.filter(item => item !== indexReponse) };
                    } else {
                        return { ...question, correct: [...question.correct, indexReponse] };
                    }
                }
                return question;
            });
        });
    };

    const handleRadioChange = (event) => {
        setRadioCheck(parseInt(event.target.value));
        setCheckedAnswers(radioCheck);
    };

    useEffect(() => {


    }, [radioCheck]);

    const handleTypeChange = (typeQuestion) => {
        const newType = parseInt(typeQuestion);
        setType(newType);
        console.log(type);
    };


    const handleCheckboxChange = (index) => {
        const updatedCheckedAnswers = [...checkedAnswers];
        updatedCheckedAnswers[index] = !updatedCheckedAnswers[index];

        setCheckedAnswers(updatedCheckedAnswers);
        validateReponse(index);
    };

    useEffect(() => {
        if (type === 2) {
            setQuestions(prevQuestions => {
                return prevQuestions.map(question => {
                    if (question.index === selected.index) {
                        return { ...question, type: type, reponses: ["Vrai", "Faux"] };
                    }
                    return question;
                });
            });
        } else {
            setQuestions(prevQuestions => {
                return prevQuestions.map(question => {
                    if (question.index === selected.index) {
                        return { ...question, type: type, reponses: ["", "", ""] };
                    }
                    return question;
                });
            });
        }

        console.log(type, "type 1");
    }, [type, selected]);

    useEffect(() => {
        setSelected(prevSelected => {
            if (type === 2) {
                return { ...prevSelected, type: type, reponses: ["Vrai", "Faux"] };
            } else {
                return { ...prevSelected, type: type, reponses: ["", "", ""] };
            }
        });
    }, [type]);

    useEffect(() => {
        if (selected) {
            let tab = [];
            selected.reponses.forEach((reponse, index) => {
                tab.push(selected.correct.includes(index));
            });
            setType(selected.type)
            setCheckedAnswers(tab);
        }
    }, [selected]);

    return (
        <div style={{ height: "100vh" }}>
            <Header />
            <div className="container-create-quizz" style={{ display: "flex" }}>
                <nav className="nav-question">

                    {questions.map(question => (
                        <Button
                            style={{                                      
                                borderBottom: "solid",
                                borderRadius: "0px",
                                height: "73px",           
                            }}
                            className="button-question"
                            key={question.index}
                            variant="plain"
                            onClick={() => { setSelected(question); setReponses(question.reponses); }}
                        >
                            <span style={{
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: "100%",
                                textAlign: "left",
                                paddingLeft: "10px",
                                fontFamily: "Nanum Pen Script",
                                fontSize: "x-large",
                                overflow: "hidden",
                            }}>{question.title === "" ? "Cliquer ici" : question.title}</span>
                        </Button>
                    ))}
                    <Box style={{ margin: "10px 5px", display: "flex", alignItems: "center" }}>
                        <IconButton onClick={addQuestion}><AddIcon style={{ fill: "#F5F5F5" }} /></IconButton>
                        <Typography style={{ color: "#F5F5F5", fontFamily: "Nanum Pen Script", fontSize: "x-large" }}>ajouter une question</Typography>
                    </Box>
                </nav>
                <div className="background-create-quizz">
                    <Input
                        onChange={(event) => setTitle(event.target.value)}
                        style={{ width: "100%", borderRadius: "0px" }}
                        id="title-input"
                        placeholder="Titre du quizz" variant="plain"
                        required
                        sx={{ '--Input-focusedThickness': '0rem', }} />
                    <Textarea
                        variant="plain"
                        value={selected.title}
                        style={{ color: "black", fontFamily: "Nanum Pen Script", fontSize: "xx-large", marginTop: "10px", width: "80%", backgroundColor: "inherit" }}
                        placeholder="Modifier la question ici"
                        onChange={(event) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[selected.index] = { ...selected, title: event.target.value };
                            setQuestions(updatedQuestions);
                            setSelected(prevSelected => ({ ...prevSelected, title: event.target.value }));
                        }}
                    />
                    <div className="answer-container" style={{ height: `${selected.reponses.length * 83 + 75}px`, marginTop: "75px" }}>
                        <div style={{ display: "flex", flexDirection: "column", width: "70%", padding: "10px 0px" }}>
                            {selected.reponses.map((reponse, index) => (
                                <div key={index} style={{ display: "flex", alignItems: "center", margin: "15px 0px" }}>
                                    <Input
                                        placeholder={"Reponse " + (index + 1)}
                                        style={{ color: "black", fontFamily: "Nanum Pen Script", fontSize: "x-large", backgroundColor: "#F5F5F5", padding: "5px", borderRadius: "10px", width: "100%" }}
                                        onChange={(event) => {
                                            const updatedReponses = [...selected.reponses];
                                            updatedReponses[index] = event.target.value;
                                            setSelected(prevSelected => ({ ...prevSelected, reponses: updatedReponses }));
                                        }}
                                        variant="plain"
                                        sx={{
                                            '--Input-focusedInset': 'var(--any, )',
                                            '--Input-focusedThickness': '0.25rem',
                                            '--Input-focusedHighlight': 'rgba(245,245,245,.25)',
                                            '&::before': {
                                              transition: 'box-shadow .15s ease-in-out',
                                            },
                                            '&:focus-within': {
                                              borderColor: '#D9D9D9',
                                            },
                                          }}
                                        disabled={type !== 2 ? false : true}
                                        value={reponse}
                                    />
                                    {type === 0 ?
                                        <Checkbox
                                            onChange={() => handleCheckboxChange(index)}
                                            checked={checkedAnswers[index] ? checkedAnswers[index] : false}
                                            style={{ color: "#F5F5F5" }}
                                        /> :
                                        <Radio
                                            checked={radioCheck === index}
                                            onChange={handleRadioChange}
                                            name="radio-buttons"
                                            value={index}
                                            style={{ padding: "9px" }} />}
                                </div>
                            ))}
                            {type !== 2 ?
                                selected.reponses.length < 6 && (
                                    <Box style={{ margin: "10px 5px", display: "flex", alignItems: "center" }}>
                                        <IconButton onClick={addReponse}><AddIcon style={{ fill: "#F5F5F5" }} /></IconButton>
                                        <Typography style={{ color: "#F5F5F5", fontFamily: "Nanum Pen Script", fontSize: "x-large" }}>ajouter une reponse</Typography>
                                    </Box>
                                ) : null}
                        </div>
                    </div>
                    <RadioGroup
                        name="radio-buttons-group"
                        value={type}
                        onChange={(event) => setType(parseInt(event.target.value))}
                        style={{ position: "absolute", left: "10px", bottom: "5%" }}
                    >
                        <Radio
                            size="lg"
                            value={0}
                            label="Choix multiple"
                            checked={type === 0}
                        />
                        <Radio
                            size="lg"
                            value={1}
                            label="Choix unique"
                            checked={type === 1}
                        />
                        <Radio
                            size="lg"
                            value={2}
                            label="Vrai Faux"
                            checked={type === 2}
                        />
                    </RadioGroup>

                    <Button
                    onClick={validateQuizz}
                        style={{ color: "black", fontFamily: "Nanum Pen Script", fontSize: "large", backgroundColor: "rgb(245 245 245)", padding: "10px", borderRadius: "20px", position: "absolute", bottom: "5%", right: "5%" }}
                    >
                        Valider le quizz
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default CreateQuizz;