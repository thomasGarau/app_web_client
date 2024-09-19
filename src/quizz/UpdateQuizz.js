import { useState, useEffect } from "react";
import { Typography, Popover } from "@mui/material";
import Textarea from '@mui/joy/Textarea';
import Button from '@mui/joy/Button';
import "./CreateQuizz.css";
import QuizzTitleInput from "./quizz_components/QuizzTitleInput";
import QuestionsDrawer from "./quizz_components/QuestionDrawer";
import ChapterSelect from "./quizz_components/ChapterSelect";
import AnswerOptions from "./quizz_components/AnswerOptions";
import AnswerContainer from "./quizz_components/AnswerContainer";
import { addQuestion, addReponse, changeQuestion, removeReponse, typeChange, validateQuizz, validateReponse } from "./quizz_services/QuizzService";
import useErrorPopover from "../composent/useErrorPopover";
import { ajouterQuestionAuQuizz, updateQuestionduQuizz, updateQuizz } from "../API/CreateQuizzAPI";
import { getChapParUE } from "../API/UeAPI";
import { useNavigate, useParams } from "react-router-dom";
import { getQuestionParQUizz, getQuizzInfo, getReponsesPourQuestion } from "../API/QuizzAPI";

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
    const [openDrawer, setOpenDrawer] = useState(false);
    const [ogQuestion, setOgQuestion] = useState([]);
    const { errorMessage, errorAnchorEl, id, openAnchor, showErrorPopover, handleClosePopover } = useErrorPopover();

    const navigate = useNavigate()

    const toggleDrawer = (newOpen) => () => {
        setOpenDrawer(newOpen);
    };


    const handleAddQuestion = () => {
        addQuestion(questions, setQuestions, quizId);
    };

    const handleAddReponse = () => {
        addReponse(selected, setSelected);
    };

    const handleChangeQuestion = (question) => {
        changeQuestion(selected, setSelected, showErrorPopover, setQuestions, question)
    }

    const handleRemoveReponse = (indexToRemove) => {
        removeReponse(indexToRemove, selected, setSelected, delAnswer, setDelAnswer);
    };


    const handleValidateQuizz = async () => {
        await validateQuizz({
            title,
            chapitre,
            questions,
            estNegatif,
            quizId,
            updateQuizz,
            navigate,
            showErrorPopover,
        });
    };


    const updateQuestion = async (e) => {
        const updatedAnswers = [
            ...selected.reponses.filter(answer => !delAnswer.includes(answer)),
            ...delAnswer
        ];
        if (selected.label === '') {
            showErrorPopover('Veuillez saisir une question.', 'question-input');
            return;
        }
        if (selected.nombre_bonne_reponse === 0) {
            showErrorPopover('Veuillez choisir au moins une réponse valide.', `reponse${selected.reponses[0].id_reponse}`);
            return;
        }
        selected.reponses.map((reponse) => {
            if (reponse.contenu === '') {
                showErrorPopover('Veuillez siasir un texte pour la réponse.', `reponse${reponse.id_reponse}`);
                
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


    const handleValidateReponse = (indexReponse) => {
        setSelected(prevSelected => validateReponse(prevSelected, indexReponse));
    };


    const handleRadioChange = (event) => {
        setRadioCheck(parseInt(event.target.value));
        setSelected(prevSelected => {
            const updatedReponses = prevSelected.reponses.map((reponse, index) => {
                return { ...reponse, est_bonne_reponse: 0 };
            });
            return { ...prevSelected, reponses: updatedReponses };
        });
        handleValidateReponse(radioCheck)
    };

    const handleTypeChange = (typeQuestion) => {
        typeChange(setSelected, typeQuestion);
    };

    useEffect(() => {
        setType(selected.type);

    }, [selected]);


    useEffect(() => {
        const fetchChapitres = async () => {
            try {
                if (idUe != null) {
                    const data = await getChapParUE(idUe);
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

    return (
        <div className="quizz-background" style={{ backgroundColor: "#C3D9FF", overflow: "auto" }}>
            <div className="container-create-quizz" style={{ display: "flex" }}>
                <QuestionsDrawer
                    open={openDrawer}
                    toggleDrawer={toggleDrawer}
                    questions={questions}
                    changeQuestion={handleChangeQuestion}
                    addQuestion={handleAddQuestion}
                />
                <div className="background-create-quizz">
                    <QuizzTitleInput
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                    />
                    <ChapterSelect
                        value={chapitre}
                        onChange={handleChangeChapitre}
                        listChapitre={listChapitre}
                    />
                    <Textarea
                        variant="plain"
                        id="question-input"
                        value={selected ? selected.label : ''}
                        sx={{ color: "black", fontSize: { xs: '1.5em', sm: '2.2em', md: '3em' }, marginTop: "10px", width: "80%", backgroundColor: "inherit" }}
                        placeholder="Modifier la question ici"
                        onChange={(event) => {
                            setSelected(prevSelected => ({ ...prevSelected, label: event.target.value }));
                        }}
                    />
                    <AnswerContainer
                        selected={selected}
                        setSelected={setSelected}
                        type={type}
                        validateReponse={handleValidateReponse}
                        handleRadioChange={handleRadioChange}
                        addReponse={handleAddReponse}
                        removeReponse={handleRemoveReponse}
                        id={id}
                    />

                    <AnswerOptions
                        type={type}
                        handleTypeChange={handleTypeChange}
                        validateQuizz={handleValidateQuizz}
                        toggleDrawer={toggleDrawer}
                        estNegatif={estNegatif}
                        setEstNegatif={setEstNegatif} >
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
                    </AnswerOptions>
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