import { useState, useEffect } from "react";
import { Box, Checkbox, Typography, Drawer, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
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
import IsoIcon from '@mui/icons-material/Iso';
import ExposureIcon from '@mui/icons-material/Exposure';
import "./CreateQuizz.css";
import { ajouterQuestionAuQuizz, createQuizz, getChapitreUE, getIdUtilisateur, updateQuestionduQuizz, updateQuizz } from "./CreateQuizzAPI";
import { getTokenAndRole } from "../services/Cookie";
import { useNavigate, useParams } from "react-router-dom";
import { getQuestionParQUizz, getQuizzInfo, getReponsesPourQuestion } from "./QuizzAPI";

function UpdateQuizz() {
    const { quizId } = useParams();
    const [idUe, setIdUe] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [selected, setSelected] = useState({})
    const [estNegatif, setEstNegatif] = useState(false)
    const [title, setTitle] = useState('');
    const [listChapitre, setListChapitre] = useState([])
    const [chapitre, setChapitre] = useState('')
    const [delAnswer, setDelAnswer] = useState([]);
    const [type, setType] = useState('')
    const [radioCheck, setRadioCheck] = useState(0)
    const [open, setOpen] = useState(false);
    const [nombreOGQuestion, setNombreOGQuestion] = useState(0);

    const navigate = useNavigate()

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };


    const addQuestion = () => {
        setQuestions(prevQuestions => [...prevQuestions, {
            id_question: questions.length,
            label: '',
            type: 'multiple',
            nombre_bonne_reponse: 0,
            id_quizz: quizId,
            answers: [
                { contenu: "", est_bonne_reponse: 0 },
                { contenu: "", est_bonne_reponse: 0 },
                { contenu: "", est_bonne_reponse: 0 }
            ]
        }]);
        const addQuestionToQuizz = async () => {
            try {
                await ajouterQuestionAuQuizz(questions[questions.length - 1].label, questions[questions.length - 1].nombre_bonne_reponse, questions[questions.length - 1].type, questions[questions.length - 1].answers, quizId);
            } catch (error) {
                console.error('Erreur lors de l\'ajout de la question', error);
            }
        };

        addQuestionToQuizz();
    };


    const addReponse = () => {
        const newReponses = [
            ...selected.answers,
            { contenu: "", est_bonne_reponse: 0 }
        ];
        setSelected(prevSelected => ({ ...prevSelected, answers: newReponses }));
        setQuestions(prevQuestions => {
            return prevQuestions.map(question => {
                if (question.index === selected.index) {
                    return { ...question, answers: newReponses };
                }
                return question;
            });
        });

    };

    const changeQuestion = (question) => {
        setSelected(question);

    };

    const removeReponse = (indexToRemove) => {
        const newReponses = [...selected.answers.slice(0, indexToRemove), ...selected.answers.slice(indexToRemove + 1)];
        setDelAnswer([...delAnswer, selected.answers[indexToRemove]]);
        setQuestions(prevQuestions => {
            return prevQuestions.map(question => {
                if (question.index === selected.index) {
                    return { ...question, answers: newReponses };
                }
                return question;
            });
        });

        setSelected(prevSelected => {
            return { ...prevSelected, answers: newReponses };
        });
    };


    const validateQuizz = async (e) => {
        try {
            await updateQuizz(parseInt(quizId), title, estNegatif ? "negatif" : "normal", chapitre.id_chapitre);
            navigate("/home");
        } catch (error) {
            console.error('Erreur lors de la création du Quizz :', error);
        }
    };

    const updateQuestion = async (e) => {
        const updatedAnswers = [
            ...selected.answers.filter(answer => !delAnswer.includes(answer)),
            ...delAnswer
          ];
          
        try {
            await updateQuestionduQuizz(selected.label, selected.nombre_bonne_reponse, type, updatedAnswers, delAnswer, selected.id_question);

        } catch (error) {
            console.error('Erreur lors de la mise à jour de la question :', error);
        }
    };

    const handleChangeChapitre = (event) => {
        setChapitre(event.target.value);
    };


    const validateReponse = (indexReponse) => {
        setSelected(prevSelected => {
            const updatedAnswers = prevSelected.answers.map((reponse, index) => {
                if (index === indexReponse) {
                    return { ...reponse, est_bonne_reponse: reponse.est_bonne_reponse === 0 ? 1 : 0 };
                }
                return reponse;
            });
            const updatedNombreBonneReponse = updatedAnswers.reduce((total, answer) => total + answer.est_bonne_reponse, 0);
                return {
                ...prevSelected,
                answers: updatedAnswers,
                nombre_bonne_reponse: updatedNombreBonneReponse
            };
        });            
    };
    

    const handleRadioChange = (event) => {
        setRadioCheck(parseInt(event.target.value));
        setSelected(prevSelected => {
            const updatedReponses = prevSelected.answers.map((reponse, index) => {
                return { ...reponse, est_bonne_reponse: 0 };
            });
            return { ...prevSelected, answers: updatedReponses };
        });
        validateReponse(radioCheck)
    };

    const handleTypeChange = (typeQuestion) => {
        setSelected(prevSelected => {
            if (prevSelected) {
                return { ...prevSelected, type: typeQuestion, answers: [...selected.answers] };
            }
            return prevSelected;
        });
    };


    useEffect(() => {
        if (selected && selected.answers && Array.isArray(selected.answers)) {
            setQuestions(prevQuestions => {
                return prevQuestions.map(question => {
                    if (question.id_question === selected.id_question) {
                        console.log(selected);
                        console.log(type);
                        return { ...question, type: type, answers: [...selected.answers] };
                    }

                    return question;
                });
            });
        }
    }, [type]);


    useEffect(() => {
        setType(selected.type);
    }, [selected]);


    useEffect(() => {
        const fetchChapitres = async () => {
            try {
                if (idUe != null) {
                    const data = await getChapitreUE(idUe);
                    setListChapitre(data);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des chapitres:', error);
            }
        };

        fetchChapitres();
    }, [idUe])


    useEffect(() => {
        const fetchStatQuestions = async () => {
            try {
                const data = await getQuizzInfo(quizId);
                const dataBis = await getQuestionParQUizz(quizId);
                console.log(data, dataBis);
                if (data && dataBis && dataBis.length > 0) {
                    const combinedQuestions = dataBis.map(questionBis => {
                        const matchingQuestion = dataBis.find(questionDetail => questionDetail.id_question === questionBis.id_question);
                        return {
                            ...questionBis,
                            ...matchingQuestion
                        };
                    });

                    const questionsWithAnswers = await Promise.all(
                        combinedQuestions.map(async question => {
                            const answers_data = await getReponsesPourQuestion(question.id_question);
                            return { ...question, answers: answers_data };
                        })
                    );
                    setQuestions(questionsWithAnswers);
                    setIdUe(data.id_ue);
                    setTitle(data.label);
                    const firstQuestion = questionsWithAnswers[0];
                    setSelected(firstQuestion);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des questions:', error);
            }
        };
        fetchStatQuestions();
    }, [quizId]);




    return (
        <div className="quizz-background" style={{ backgroundColor: "#C3D9FF", overflow: "auto" }}>
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
                                key={question.id_question}
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
                                }}>{question.label === "" ? "Cliquer ici" : question.label}</span>
                            </Button>
                        ))}
                        <Box style={{ margin: "10px 5px", display: "flex", alignItems: "center" }}>
                            <IconButton className="icon-add" style={{ transition: "0.2s" }} onClick={addQuestion}>
                                <AddIcon style={{ fill: "#F5F5F5" }} />
                            </IconButton>
                            <Typography style={{ color: "#F5F5F5", fontSize: "x-large" }}>ajouter une question</Typography>
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
                        value={title}
                        sx={{ '--Input-focusedThickness': '0rem', }} />
                    <FormControl sx={{ width: "300px" }}>
                        <InputLabel id="demo-simple-select-label">Chapitre</InputLabel>
                        <Select
                            sx={{
                                width: "100%",
                                borderRadius: "10px",
                                backgroundColor: "#f0f0f0"
                            }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={chapitre}
                            label="Chapitrem"
                            onChange={handleChangeChapitre}
                        >
                            {listChapitre.length > 0 && listChapitre.map((chap, index) => (
                                <MenuItem key={index} value={chap}>{chap.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Textarea
                        variant="plain"
                        value={selected ? selected.label : ''}
                        style={{ color: "black", fontSize: "xx-large", marginTop: "10px", width: "80%", backgroundColor: "inherit" }}
                        placeholder="Modifier la question ici"
                        onChange={(event) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[selected.index] = { ...selected, titre: event.target.value };
                            setQuestions(updatedQuestions);
                            setSelected(prevSelected => ({ ...prevSelected, titre: event.target.value }));
                        }}
                    />
                    <div className="answer-container" style={{ height: `${selected.answers ? selected.answers.length * 100 + 100 : 83 + 75}px`, overflowY: "auto", maxHeight: "60%" }}>
                        <div style={{ display: "flex", flexDirection: "column", width: "70%", padding: "10px 0px" }}>
                            {selected.answers && selected.answers.map((reponse, index) => (
                                <div key={index} style={{ display: "flex", alignItems: "center", margin: "15px 0px", justifyContent: "space-between" }}>
                                    <Input
                                        placeholder={"Reponse " + (index + 1)}
                                        style={{ color: "black", fontSize: "x-large", backgroundColor: "#F5F5F5", padding: "5px", borderRadius: "10px", width: "100%" }}
                                        onChange={(event) => {
                                            const updatedReponses = [...selected.answers];
                                            updatedReponses[index].contenu = event.target.value;
                                            setSelected(prevSelected => ({ ...prevSelected, answers: updatedReponses }));
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
                                        value={reponse.contenu}
                                    />

                                    {type === 'multiple' ?
                                        <Checkbox
                                            onChange={() => validateReponse(index)}
                                            checked={reponse.est_bonne_reponse === 1 ? true : false}
                                            style={{ color: "#F5F5F5" }}
                                        /> :
                                        <Radio
                                            checked={radioCheck === index}
                                            onChange={handleRadioChange}
                                            name="radio-buttons"
                                            value={index}
                                            style={{ padding: "9px" }} />}
                                    <IconButton onClick={() => removeReponse(index)} className="icon-add" style={{ transition: "0.2s" }}>
                                        <DeleteIcon style={{ fill: "#f5f5f5" }} />
                                    </IconButton>
                                </div>
                            ))}
                            {type !== 2 && selected.answers ?
                                selected.answers.length < 6 && (
                                    <Box style={{ margin: "10px 5px", display: "flex", alignItems: "center" }}>
                                        <IconButton onClick={addReponse} className="icon-add" style={{ transition: "0.2s" }}>
                                            <AddIcon style={{ fill: "#F5F5F5" }} />
                                        </IconButton>
                                        <Typography style={{ color: "#F5F5F5", fontSize: "x-large" }}>
                                            ajouter une reponse
                                        </Typography>
                                    </Box>
                                ) : null}
                        </div>
                    </div>

                    {window.visualViewport.width <= 890 ?
                        <>

                            <RadioGroup
                                name="radio-buttons-group"
                                value={type}
                                onChange={(event) => handleTypeChange(event.target.value)}
                                style={{ position: "fixed", left: "3%", bottom: "12.5%" }}
                            >
                                <Radio
                                    size="lg"
                                    value={'multiple'}

                                    label="CM"
                                    checked={type === 'multiple'}
                                />
                                <Radio
                                    size="lg"
                                    value={'seul'}
                                    label="CU"
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
                                style={{
                                    color: "black",
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
                        </> :
                        <>
                            <RadioGroup
                                name="radio-buttons-group"
                                value={type}
                                onChange={(event) => handleTypeChange(event.target.value)}
                                style={{ position: "fixed", left: "10px", bottom: "5%" }}
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

                            <Button
                                onClick={validateQuizz}
                                sx={{
                                    color: "black",
                                    fontSize: "large",
                                    backgroundColor: "rgb(245 245 245)",
                                    padding: "10px",
                                    borderRadius: "20px",
                                    position: "fixed",
                                    bottom: "5%",
                                    right: "1%",
                                    transitionDuration: '0.4s',
                                    '&:hover': {
                                        boxShadow: '0 12px 16px 0 rgba(0,0,0,0.4), 0 17px 50px 0 rgba(0,0,0,0.3)',
                                        backgroundColor: 'rgb(245, 245, 245)',
                                    },
                                }}
                            >
                                Valider le quizz
                            </Button>
                            <Button sx={{
                                position: "fixed",
                                left: "1%",
                                bottom: "20%",
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
                            <Button
                                sx={{
                                    color: "black",
                                    fontSize: "large",
                                    backgroundColor: "rgb(245, 245, 245)",
                                    padding: "10px",
                                    borderRadius: "20px",
                                    position: "fixed",
                                    bottom: "12.5%",
                                    right: "1%",
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
                            <Button
                                onClick={updateQuestion}
                                sx={{
                                    color: "black",
                                    fontSize: "large",
                                    backgroundColor: "rgb(245 245 245)",
                                    padding: "10px",
                                    borderRadius: "20px",
                                    position: "fixed",
                                    bottom: "20%",
                                    right: "1%",
                                    transitionDuration: '0.4s',
                                    '&:hover': {
                                        boxShadow: '0 12px 16px 0 rgba(0,0,0,0.4), 0 17px 50px 0 rgba(0,0,0,0.3)',
                                        backgroundColor: 'rgb(245, 245, 245)',
                                    },
                                }}
                            >
                                Valider la question
                            </Button>

                        </>
                    }
                </div>
            </div>
        </div>
    );
}

export default UpdateQuizz;