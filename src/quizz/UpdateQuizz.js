import { useState, useEffect } from "react";
import { Box, Checkbox, Typography, Drawer, MenuItem, FormControl, InputLabel, Select, Popover } from "@mui/material";
import IconButton from '@mui/joy/IconButton';
import Textarea from '@mui/joy/Textarea';
import Input from '@mui/joy/Input';
import Radio from '@mui/joy/Radio';
import Button from '@mui/joy/Button';
import RadioGroup from '@mui/joy/RadioGroup';
import AddIcon from '@mui/icons-material/Add';
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
    const [ogQuestion, setOgQuestion] = useState([]);
    const [errorAnchorEl, setErrorAnchorEl] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [id, setId] = useState(undefined);
    const [openAnchor, setOpenAnchor] = useState(false);

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
            id_quizz: parseInt(quizId),
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
        setSelected(prevSelected => ({ ...prevSelected, reponses: newReponses }));
    };

    const changeQuestion = (question) => {
        setQuestions(prevQuestions => {
            return prevQuestions.map(question => {
                if (question.id_question === selected.id_question) {
                    return selected;
                }
                return question;
            });
        });
        setSelected(question);

    };

    const removeReponse = (indexToRemove) => {
        const newReponses = [...selected.reponses.slice(0, indexToRemove), ...selected.reponses.slice(indexToRemove + 1)];
        setDelAnswer([...delAnswer, selected.reponses[indexToRemove]]);
        setSelected(prevSelected => {
            return { ...prevSelected, reponses: newReponses };
        });
    };


    const validateQuizz = async (e) => {
        if (!/[a-zA-Z0-9]/.test(title)) {
            setErrorMessage('Veuillez saisir un titre valide pour le quizz.');
            setErrorAnchorEl(document.getElementById('title-input'));
            setId('error-popover');
            setOpenAnchor(true);
            return;
        }
        if (chapitre === '') {
            setErrorMessage('Veuillez choisir un chapitre.');
            setErrorAnchorEl(document.getElementById('label-chapitre'));
            setId('error-popover');
            setOpenAnchor(true);
            return;
        }
        try {
            await updateQuizz(parseInt(quizId), title, estNegatif ? "negatif" : "normal", chapitre.id_chapitre);
            navigate("/home");
        } catch (error) {
            console.error('Erreur lors de la création du Quizz :', error);
        }
    };

    const updateQuestion = async (e) => {
        const updatedAnswers = [
            ...selected.reponses.filter(answer => !delAnswer.includes(answer)),
            ...delAnswer
        ];
        if (selected.label === '') {
            setErrorMessage('Veuillez saisir une question.');
            setErrorAnchorEl(document.getElementById('question-input'));
            setId('error-popover');
            setOpenAnchor(true);
            return;
        }
        if (selected.nombre_bonne_reponse === 0) {
            setErrorMessage('Veuillez choisir au moins une réponse valide.');
            setErrorAnchorEl(document.getElementById(`reponse${selected.reponses[0].id_reponse}`));
            setId('error-popover');
            setOpenAnchor(true);
            return;
        }
        selected.reponses.map((reponse) => {
            if (reponse.contenu === '') {
                setErrorMessage('Veuillez siasir un texte pour la réponse.');
                setErrorAnchorEl(document.getElementById(`reponse${reponse.id_reponse}`));
                setId('error-popover');
                setOpenAnchor(true);
                return;
            };
        });

        try {
            const all_id = [];
            ogQuestion.map((question) => {
                all_id.push(question.id_question);
            });
            if (all_id.includes(selected.id_question)) {
                await updateQuestionduQuizz(selected.label, selected.nombre_bonne_reponse, type, updatedAnswers, delAnswer, selected.id_question);
            } else {
                await ajouterQuestionAuQuizz(selected.label, selected.nombre_bonne_reponse, type, updatedAnswers, parseInt(quizId));
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la question :', error);
        }
    };

    const handleChangeChapitre = (event) => {
        setChapitre(event.target.value);
    };


    const validateReponse = (indexReponse) => {
        setSelected(prevSelected => {
            const updatedAnswers = prevSelected.reponses.map((reponse, index) => {
                if (index === indexReponse) {
                    return { ...reponse, est_bonne_reponse: reponse.est_bonne_reponse === 0 ? 1 : 0 };
                }
                return reponse;
            });
            const updatedNombreBonneReponse = updatedAnswers.reduce((total, answer) => total + answer.est_bonne_reponse, 0);
            return {
                ...prevSelected,
                reponses: updatedAnswers,
                nombre_bonne_reponse: updatedNombreBonneReponse
            };
        });
    };


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

    const handleTypeChange = (typeQuestion) => {
        setSelected(prevSelected => {
            if (prevSelected) {
                return { ...prevSelected, type: typeQuestion, reponses: [...selected.reponses] };
            }
            return prevSelected;
        });
    };

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
                const data = await getQuizzInfo(parseInt(quizId));
                const dataBis = await getQuestionParQUizz(parseInt(quizId));
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
                            const reponses_data = await getReponsesPourQuestion(question.id_question);
                            return { ...question, reponses: reponses_data };
                        })
                    );
                    setQuestions(questionsWithAnswers);
                    setOgQuestion(questionsWithAnswers);
                    setIdUe(data.id_ue);
                    setTitle(data.label);
                    const firstQuestion = questionsWithAnswers[0];
                    setSelected(firstQuestion);
                    selected.reponses && selected.reponses.map((reponse) => {
                        if (reponse.est_bonne_reponse === 1) {
                            setRadioCheck(selected.reponses.indexOf(reponse));
                        }
                    });
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des questions:', error);
            }
        };
        fetchStatQuestions();
    }, [quizId]);

    const handleClosePopover = () => {
        setErrorAnchorEl(null);
        setErrorMessage('');
        setOpenAnchor(false);
    };


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
                                }}>{question.label === '' ? "Cliquer ici" : question.label}</span>
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
                        <InputLabel id="label-chapitre">Chapitre</InputLabel>
                        <Select
                            sx={{
                                width: "100%",
                                borderRadius: "10px",
                                backgroundColor: "#f0f0f0"
                            }}
                            labelId="label-chapitre"
                            id="select-chapitre"
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
                        id="question-input"
                        value={selected ? selected.label : ''}
                        sx={{ color: "black", fontSize: {xs: '1.5em', sm:'2.2em', md: '3em'}, marginTop: "10px", width: "80%", backgroundColor: "inherit" }}
                        placeholder="Modifier la question ici"
                        onChange={(event) => {
                            setSelected(prevSelected => ({ ...prevSelected, label: event.target.value }));
                        }}
                    />
                    <div className="answer-container" style={{ height: `${selected.reponses ? selected.reponses.length * 100 + 100 : 83 + 75}px`, overflowY: "auto", maxHeight: "60%" }}>
                        <div style={{ display: "flex", flexDirection: "column", width: "70%", padding: "10px 0px" }}>
                            {selected.reponses && selected.reponses.map((reponse, index) => (
                                <div key={index} style={{ display: "flex", alignItems: "center", margin: "15px 0px", justifyContent: "space-between" }}>
                                    <Input
                                        aria-describedby={id}
                                        id={"reponse" + reponse.id_reponse}
                                        placeholder={"Reponse " + (index + 1)}
                                        onChange={(event) => {
                                            const updatedReponses = [...selected.reponses];
                                            updatedReponses[index].contenu = event.target.value;
                                            setSelected(prevSelected => ({ ...prevSelected, reponses: updatedReponses }));

                                        }}
                                        variant="plain"
                                        sx={{
                                            color: "black", fontSize: { xs: "1em", md: "2em" }, backgroundColor: "#F5F5F5", padding: "5px", borderRadius: "10px", width: "100%",
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
                                            aria-describedby={id}
                                            onChange={() => validateReponse(index)}
                                            checked={reponse.est_bonne_reponse === 1 ? true : false}
                                            style={{ color: "#F5F5F5" }}
                                            id={"checkbox-reponse" + reponse.id_reponse}
                                        /> :
                                        <Radio
                                            checked={reponse.est_bonne_reponse === 1 ? true : false}
                                            onChange={handleRadioChange}
                                            name="radio-buttons"
                                            value={index}
                                            style={{ padding: "9px" }} />}
                                    <IconButton onClick={() => removeReponse(index)} className="icon-add" style={{ transition: "0.2s" }}>
                                        <DeleteIcon style={{ fill: "#f5f5f5" }} />
                                    </IconButton>
                                </div>
                            ))}
                            {type !== 2 && selected.reponses ?
                                selected.reponses.length < 6 && (
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
                    <Popover
                        id={id}
                        open={openAnchor}
                        anchorEl={errorAnchorEl}
                        onClose={handleClosePopover}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <Typography sx={{ p: 2 }}>{errorMessage}</Typography>
                    </Popover>
                </div>
            </div>
        </div>
    );
}

export default UpdateQuizz;