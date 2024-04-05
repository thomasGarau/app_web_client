import { useState, useEffect } from "react";
import { Box, Checkbox, Typography, Drawer } from "@mui/material";
import IconButton from '@mui/joy/IconButton';
import Textarea from '@mui/joy/Textarea';
import Input from '@mui/joy/Input';
import Radio from '@mui/joy/Radio';
import Button from '@mui/joy/Button';
import RadioGroup from '@mui/joy/RadioGroup';
import AddIcon from '@mui/icons-material/Add';
import Header from "../composent/Header";
import CheckIcon from '@mui/icons-material/Check';
import QuizIcon from '@mui/icons-material/Quiz';
import DeleteIcon from '@mui/icons-material/Delete';
import "./CreateQuizz.css";

function CreateQuizz() {
    const [questions, setQuestions] = useState([{ index: 0, title: "Premiere question", type: 0, reponses: ["un truc", "un machin", "une chose"], correct: [] }]);
    const [selected, setSelected] = useState(questions[0]);
    const [title, setTitle] = useState("");
    const [reponses, setReponses] = useState(questions[0].reponses);
    const [type, setType] = useState(selected.type)
    const [checkedAnswers, setCheckedAnswers] = useState(Array(selected.reponses.length).fill(false));
    const [radioCheck, setRadioCheck] = useState(0)
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };


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

    const removeReponse = (indexToRemove) => {
        const newReponses = [...reponses.slice(0, indexToRemove), ...reponses.slice(indexToRemove + 1)];
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
        newReponses.forEach((reponse, index) => {
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
        setType(typeQuestion);
        console.log(type);
    };


    const handleCheckboxChange = (index) => {
        const updatedCheckedAnswers = [...checkedAnswers];
        updatedCheckedAnswers[index] = !updatedCheckedAnswers[index];

        setCheckedAnswers(updatedCheckedAnswers);
        validateReponse(index);
    };

    useEffect(() => {
        setQuestions(prevQuestions => {
            return prevQuestions.map(question => {
                if (question.index === selected.index) {
                    if (type === 2) {
                        return { ...question, type: type, reponses: ["Vrai", "Faux"] };
                    } else {
                        return { ...question, type: type, reponses: [...reponses] };
                    }
                }
                return question;
            });
        });
    }, [type, selected]);
    
    useEffect(() => {
        setSelected(prevSelected => {
            if (prevSelected) {
                if (type === 2) {
                    return { ...prevSelected, type: type, reponses: ["Vrai", "Faux"] };
                } else {
                    return { ...prevSelected, type: type, reponses: [...reponses]}; 
                }
            }
            return prevSelected;
        });
        console.log(selected)
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
        <div className="quizz-background" style={{ backgroundColor: "#C3D9FF", overflow:"auto" }}>
            <Header />

            <div className="container-create-quizz" style={{ display: "flex" }}>
                <Drawer PaperProps={{
                    style: {
                        width: "250px",
                        backgroundColor: "#133D56",
                    },
                }} open={open} onClose={toggleDrawer(false)}>
                    <div style={{ backgroundColor: "#133D56" }}>
                        {questions.map(question => (
                            <Button
                                style={{
                                    borderBottom: "solid",
                                    borderRadius: "0px",
                                    height: "73px",
                                    color: "#f5f5f5",
                                    transition: "0.2s",
                                    width: "100%"
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
                            <IconButton className="icon-add" style={{ transition: "0.2s" }} onClick={addQuestion}>
                                <AddIcon style={{ fill: "#F5F5F5" }} />
                            </IconButton>
                            <Typography style={{ color: "#F5F5F5", fontFamily: "Nanum Pen Script", fontSize: "x-large" }}>ajouter une question</Typography>
                        </Box>
                    </div>
                </Drawer>
                <div className="background-create-quizz">
                    <Input
                        onChange={(event) => setTitle(event.target.value)}
                        style={{ width: "80%", borderRadius: "0px", borderRadius: "0px 0px 10px 10px", backgroundColor: "#f5f5f5" }}
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
                    <div className="answer-container" style={{ height: `${selected.reponses.length * 83 + 75}px` }}>
                        <div style={{ display: "flex", flexDirection: "column", width: "70%", padding: "10px 0px" }}>
                            {selected.reponses.map((reponse, index) => (
                                <div key={index} style={{ display: "flex", alignItems: "center", margin: "15px 0px", justifyContent: "space-between" }}>
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
                                        <IconButton onClick={() => removeReponse(index)}><DeleteIcon style={{fill: "#f5f5f5"}}/></IconButton>
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

                    {window.visualViewport.width <= 600 ?
                        <>
                            <RadioGroup
                                name="radio-buttons-group"
                                value={type}
                                onChange={(event) => handleTypeChange(parseInt(event.target.value))}
                                style={{ position: "fixed", right: "10px", bottom: "25%" }}
                            >
                                <Radio
                                    size="lg"
                                    value={0}
                                    
                                    label="CM"
                                    checked={type === 0}
                                />
                                <Radio
                                    size="lg"
                                    value={1}
                                    label="CU"
                                    checked={type === 1}
                                />
                                <Radio
                                    size="lg"
                                    value={2}
                                    label="VF"
                                    checked={type === 2}
                                />
                            </RadioGroup>

                            <IconButton
                                onClick={validateQuizz}
                                style={{
                                    color: "black",
                                    fontFamily: "Nanum Pen Script",
                                    fontSize: "large",
                                    backgroundColor: "rgb(245 245 245)",
                                    padding: "10px",
                                    borderRadius: "20px",
                                    position: "fixed",
                                    bottom: "5%",
                                    right: "3%"
                                }}
                            ><CheckIcon />
                            </IconButton>
                            <IconButton style={{
                                position: "fixed",
                                right: "3%",
                                bottom: "15%",
                                color: "black",
                                fontFamily: "Nanum Pen Script",
                                fontSize: "large",
                                backgroundColor: "rgb(245 245 245)",
                                padding: "10px",
                                borderRadius: "20px"
                            }}
                                onClick={toggleDrawer(true)}>
                                <QuizIcon /></IconButton></> :
                        <>
                            <RadioGroup
                                name="radio-buttons-group"
                                value={type}
                                onChange={(event) => handleTypeChange(parseInt(event.target.value))}
                                style={{ position: "fixed", left: "10px", bottom: "5%" }}
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
                                style={{
                                    color: "black",
                                    fontFamily: "Nanum Pen Script",
                                    fontSize: "large",
                                    backgroundColor: "rgb(245 245 245)",
                                    padding: "10px",
                                    borderRadius: "20px",
                                    position: "fixed",
                                    bottom: "5%",
                                    right: "5%"
                                }}
                            >
                                Valider le quizz
                            </Button>
                            <Button style={{
                                position: "fixed",
                                left: "10px",
                                bottom: "20%",
                                color: "black",
                                fontFamily: "Nanum Pen Script",
                                fontSize: "large",
                                backgroundColor: "rgb(245 245 245)",
                                padding: "10px",
                                borderRadius: "20px"
                            }}
                                onClick={toggleDrawer(true)}>Menu des questions</Button></>}
                </div>
            </div>
        </div>
    );
}

export default CreateQuizz;