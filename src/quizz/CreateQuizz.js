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
import { createQuizz, getChapitreUE, getIdUtilisateur } from "./CreateQuizzAPI";
import { getTokenAndRole } from "../services/Cookie";
import { useNavigate, useParams } from "react-router-dom";

function CreateQuizz() {
    const { idUE } = useParams();
    const [questions, setQuestions] = useState([{
        index: 0,
        titre: "Premiere question",
        type: 0,
        reponses: [
            { contenu: "un truc", est_bonne_reponse: 0 },
            { contenu: "un machin", est_bonne_reponse: 0 },
            { contenu: "une chose", est_bonne_reponse: 0 }]
    }]);
    const [selected, setSelected] = useState(questions[0])
    const [estNegatif, setEstNegatif] = useState(false)
    const [title, setTitle] = useState('');
    const [listChapitre, setListChapitre] = useState([])
    const [chapitre, setChapitre] = useState({ id_chapitre: 0, label: "" })
    const [reponses, setReponses] = useState(questions[0].reponses);
    const [type, setType] = useState(selected.type)
    const [radioCheck, setRadioCheck] = useState(0)
    const [open, setOpen] = useState(false);

    const navigate = useNavigate()

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };


    const addQuestion = () => {
        setQuestions(prevQuestions => [...prevQuestions, {
            index: questions.length,
            titre: "",
            type: 0,
            reponses: [
                { contenu: "", est_bonne_reponse: 0 },
                { contenu: "", est_bonne_reponse: 0 },
                { contenu: "", est_bonne_reponse: 0 }
            ]
        }]);
    };


    const addReponse = () => {
        const newReponses = [
            ...selected.reponses,
            { contenu: "", est_bonne_reponse: 0 }
        ];
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
    };


    const validateQuizz = async (e) => {
        e.preventDefault();
        let nombre_bonne_reponse = 0;
        const questionsFormatEnvoi = questions.map((question, index) => {
            const bonnesReponses = question.reponses.filter(reponse => reponse.est_bonne_reponse == 1);
            nombre_bonne_reponse += bonnesReponses.length;
            return {
                label: question.titre,
                nombre_bonne_reponse: bonnesReponses.length,
                type: question.type === 0 ? "Choix multiple" : question.type === 1 ? "Choix unique" : "Vrai Faux",
                reponses: question.reponses
            };
        });
        console.log(chapitre.id_chapitre)
        try {
            await createQuizz(title, estNegatif ? "negatif" : "normal", chapitre.id_chapitre, questionsFormatEnvoi);
            navigate("/secure_page");
        } catch (error) {
            console.error('Erreur lors de la création du Quizz :', error);
        }
    };


    const handleChangeChapitre = (event) => {
        setChapitre({ id_chapitre: event.target.value.id_chapitre, label:event.target.value.label });
    };

    const validateReponse = (indexReponse) => {
        setSelected(prevSelected => {
            const updatedReponses = prevSelected.reponses.map((reponse, index) => {
                if (index === indexReponse) {
                    return { ...reponse, est_bonne_reponse: reponse.est_bonne_reponse == 0 ? 1 : 0 };
                }
                return reponse;
            });
            return { ...prevSelected, reponses: updatedReponses };
        });

    };

    useEffect(() => {
        console.log(questions)
    }, [questions])

    useEffect(() => {
        console.log(chapitre)
    }, [chapitre])


    const handleRadioChange = (event) => {
        setRadioCheck(parseInt(event.target.value));
        setSelected(prevSelected => {
            const updatedReponses = prevSelected.reponses.map((reponse, index) => {
                return { ...reponse, est_bonne_reponse: 0 };
            });
            return { ...prevSelected, reponses: updatedReponses };
        });
        validateReponse(radioCheck)
    };


    useEffect(() => {
        console.log(radioCheck)
    }, [radioCheck]);

    const handleTypeChange = (typeQuestion) => {
        setType(typeQuestion);
        console.log(type);
    };


    useEffect(() => {
        setQuestions(prevQuestions => {
            return prevQuestions.map(question => {
                if (question.index === selected.index) {
                    if (type === 2) {
                        return { ...question, type: type, reponses: [{ contenu: "Vrai", est_bonne_reponse: 1 }, { contenu: "Faux", est_bonne_reponse: 0 }] };
                    } else {
                        return { ...question, type: type, reponses: [...selected.reponses] };
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
                    return { ...prevSelected, type: type, reponses: [{ contenu: "Vrai", est_bonne_reponse: 1 }, { contenu: "Faux", est_bonne_reponse: 0 }] };
                } else {
                    return { ...prevSelected, type: type, reponses: [...reponses] };
                }
            }
            return prevSelected;
        });
    }, [type]);


    useEffect(() => {
        console.log(listChapitre);
    }, [listChapitre]);

    useEffect(() => {
        const fetchChapitres = async () => {
            try {
                const chapitres = await getChapitreUE(1);
                setListChapitre(chapitres);
            } catch (error) {
                console.error('Erreur lors de la récupération des chapitres:', error);
            }
        };

        fetchChapitres();
    }, [])

    useEffect(() => {
        if (selected) {
            setType(selected.type);
        }
        console.log(selected)
    }, [selected]);


    useEffect(() => {

    }, [estNegatif])


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
                                    fontSize: "x-large",
                                    overflow: "hidden",
                                }}>{question.titre === "" ? "Cliquer ici" : question.titre}</span>
                            </Button>
                        ))}
                        <Box style={{ margin: "10px 5px", display: "flex", alignItems: "center" }}>
                            <IconButton className="icon-add" style={{ transition: "0.2s" }} onClick={addQuestion}>
                                <AddIcon style={{ fill: "#F5F5F5" }} />
                            </IconButton>
                            <Typography style={{ color: "#F5F5F5",  fontSize: "x-large" }}>ajouter une question</Typography>
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
                            {listChapitre && listChapitre.map((chapitre, index) => (
                                <MenuItem key={index} value={chapitre}>{chapitre.label}</MenuItem>
                            ))}
                        </Select>

                    </FormControl>

                    <Textarea
                        variant="plain"
                        value={selected.titre}
                        style={{ color: "black",  fontSize: "xx-large", marginTop: "10px", width: "80%", backgroundColor: "inherit" }}
                        placeholder="Modifier la question ici"
                        onChange={(event) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[selected.index] = { ...selected, titre: event.target.value };
                            setQuestions(updatedQuestions);
                            setSelected(prevSelected => ({ ...prevSelected, titre: event.target.value }));
                        }}
                    />
                    <div className="answer-container" style={{ height: `${selected.reponses.length * 83 + 75}px`, overflowY: "auto", maxHeight: "350px" }}>
                        <div style={{ display: "flex", flexDirection: "column", width: "70%", padding: "10px 0px" }}>
                            {selected.reponses.map((reponse, index) => (
                                <div key={index} style={{ display: "flex", alignItems: "center", margin: "15px 0px", justifyContent: "space-between" }}>
                                    <Input
                                        placeholder={"Reponse " + (index + 1)}
                                        style={{ color: "black",  fontSize: "x-large", backgroundColor: "#F5F5F5", padding: "5px", borderRadius: "10px", width: "100%" }}
                                        onChange={(event) => {
                                            const updatedReponses = [...selected.reponses];
                                            updatedReponses[index].contenu = event.target.value;
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
                                        value={reponse.contenu}
                                    />
                                    {type === 0 ?
                                        <Checkbox
                                            onChange={() => validateReponse(index)}
                                            checked={reponse.est_bonne_reponse == 1 ? true : false}
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
                            {type !== 2 ?
                                selected.reponses.length < 6 && (
                                    <Box style={{ margin: "10px 5px", display: "flex", alignItems: "center" }}>
                                        <IconButton onClick={addReponse} className="icon-add" style={{ transition: "0.2s" }}>
                                            <AddIcon style={{ fill: "#F5F5F5" }} />
                                        </IconButton>
                                        <Typography style={{ color: "#F5F5F5",  fontSize: "x-large" }}>
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
                                onChange={(event) => handleTypeChange(parseInt(event.target.value))}
                                style={{ position: "fixed", left: "3%", bottom: "12.5%" }}
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
                                sx={{
                                    color: "black",
                                    fontSize: "large",
                                    backgroundColor: "rgb(245 245 245)",
                                    padding: "10px",
                                    borderRadius: "20px",
                                    position: "fixed",
                                    bottom: "5%",
                                    right: "5%",
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
                                left: "10px",
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
                                    right: "5%",
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

                        </>
                    }
                </div>
            </div>
        </div>
    );
}

export default CreateQuizz;