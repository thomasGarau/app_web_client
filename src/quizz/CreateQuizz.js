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
import { createQuizz } from "../API/CreateQuizzAPI";
import { getChapParUE } from "../API/UeAPI";
import { useNavigate, useParams } from "react-router-dom";

function UpdateQuizz() {
    const { idUe } = useParams();
    const [questions, setQuestions] = useState([{
        id_question: 0,
        label: '',
        type: 'multiple',
        nombre_bonne_reponse: 0,
        reponses: [
            { contenu: "", est_bonne_reponse: 0 },
            { contenu: "", est_bonne_reponse: 0 },
            { contenu: "", est_bonne_reponse: 0 }
        ]
    }]);
    const [selected, setSelected] = useState(questions[0])
    const [estNegatif, setEstNegatif] = useState(false)
    const [title, setTitle] = useState('');
    const [listChapitre, setListChapitre] = useState([])
    const [chapitre, setChapitre] = useState('')
    const [type, setType] = useState('')
    const [open, setOpen] = useState(false);
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

    const changeQuestion = (newQuestion) => {
        if(selected.nombre_bonne_reponse === 0) {
            setErrorMessage('Veuillez choisir au moins une bonne réponse.');
            setErrorAnchorEl(document.getElementById('radio1'));
            setId('error-popover');
            setOpenAnchor(true);
            return;
        }
        setQuestions(prevQuestions => {
            return prevQuestions.map(question => {
                if (question.id_question === selected.id_question) {
                    return selected;
                }
                return question;
            });
        });

        setSelected(newQuestion);
        console.log(newQuestion);
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };


    const removeReponse = (indexToRemove) => {
        const newReponses = [...selected.reponses.slice(0, indexToRemove), ...selected.reponses.slice(indexToRemove + 1)];
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
            setErrorAnchorEl(document.getElementById('select-chapitre'));
            setId('error-popover');
            setOpenAnchor(true);
            return;
        }
        try {
            const questionsWithoutId = questions.map(({ id_question, ...rest }) => rest);
            await createQuizz(title, estNegatif ? "negatif" : "normal", chapitre.id_chapitre, questionsWithoutId);
            navigate("/gestion_quizz");
        } catch (error) {
            console.error('Erreur lors de la création du Quizz :', error);
            setErrorMessage('Erreur lors de la création du Quizz :', error);
            setErrorAnchorEl(document.getElementById('title-input'));
            setId('error-popover');
            setOpenAnchor(true);
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


    const handleRadioChange = (indexReponse) => {
        setSelected(prevSelected => {
            // Mettre à jour les réponses pour réinitialiser 'est_bonne_reponse'
            const updatedReponses = prevSelected.reponses.map((reponse) => ({
                ...reponse,
                est_bonne_reponse: 0
            }));
    
            // Mettre à jour la réponse sélectionnée
            const newUpdatedReponses = updatedReponses.map((reponse, index) => {
                if (index === indexReponse) {
                    return { ...reponse, est_bonne_reponse: 1 };
                }
                return reponse;
            });
    
            const updatedNombreBonneReponse = newUpdatedReponses.reduce((total, reponse) => total + reponse.est_bonne_reponse, 0);
    
            return {
                ...prevSelected,
                reponses: newUpdatedReponses,
                nombre_bonne_reponse: updatedNombreBonneReponse
            };
        });
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
                const data = await getChapParUE(parseInt(idUe));
                setListChapitre(data);

            } catch (error) {
                console.error('Erreur lors de la récupération des chapitres:', error);
            }
        };

        fetchChapitres();
    }, []);

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
                        {questions.map((question, index) => (
                            <Button
                                key={index} // Utilise "index" plutôt que "question.index"
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
                        aria-describedby={id}
                        onChange={handleTitleChange}
                        style={{ width: "80%", borderRadius: "0px", borderRadius: "0px 0px 10px 10px", backgroundColor: "#f5f5f5" }}
                        id="title-input"
                        placeholder="Titre du quizz"
                        variant="plain"
                        required
                        value={title}
                        sx={{ '--Input-focusedThickness': '0rem', }} />
                    <FormControl sx={{ width: "300px" }}>
                        <InputLabel id="chapitre-label">Chapitre</InputLabel>
                        <Select
                            aria-describedby={id}
                            sx={{
                                width: "100%",
                                borderRadius: "10px",
                                backgroundColor: "#f0f0f0"
                            }}
                            labelId="chapitre-label"
                            id="select-chapitre"
                            value={chapitre}
                            label="Chapitre"
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
                        sx={{ color: "black", fontSize: { xs: '1.2em', sm: '1.5em', md: '2em' }, marginTop: "10px", width: "80%", backgroundColor: "inherit" }}
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
                                        placeholder={"Reponse " + (index + 1)}
                                        onChange={(event) => {
                                            const updatedReponses = [...selected.reponses];
                                            updatedReponses[index].contenu = event.target.value;
                                            setSelected(prevSelected => ({ ...prevSelected, reponses: updatedReponses }));
                                        }}
                                        variant="plain"
                                        sx={{
                                            color: "black", fontSize: { xs: '0.8em', sm: '1.4em', md: '2em' }, backgroundColor: "#F5F5F5", padding: "5px", borderRadius: "10px", width: "100%",
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
                                            checked={reponse.est_bonne_reponse === 1}
                                            style={{ color: "#F5F5F5" }}
                                        /> :
                                        <Radio
                                            checked={reponse.est_bonne_reponse === 1}
                                            onChange={() => handleRadioChange(index)}
                                            id={'radio' + index}
                                            name="radio-buttons"
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
                            <Box sx={{
                                position: "fixed",
                                left: "1%",
                                bottom: "5%",
                                display: "flex",
                                flexDirection: "column-reverse",
                            }}>
                                <RadioGroup
                                    name="radio-buttons-group"
                                    value={type}
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
                            </Box>




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