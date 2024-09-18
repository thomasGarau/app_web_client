import { useState, useEffect } from "react";
import { Typography, Popover } from "@mui/material";
import Textarea from '@mui/joy/Textarea';
import "./CreateQuizz.css";
import { createQuizz } from "../API/CreateQuizzAPI";
import { getChapParUE } from "../API/UeAPI";
import { useNavigate, useParams } from "react-router-dom";
import QuestionsDrawer from "./quizz_components/QuestionDrawer";
import QuizzTitleInput from "./quizz_components/QuizzTitleInput";
import ChapterSelect from "./quizz_components/ChapterSelect";
import AnswerOptions from "./quizz_components/AnswerOptions";
import AnswerContainer from "./quizz_components/AnswerContainer";
import { addQuestion, addReponse, changeQuestion, removeReponse, typeChange, validateQuizz, validateReponse } from "./quizz_services/QuizzService";
import useErrorPopover from '../composent/useErrorPopover';

function CreateQuizz() {
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
    const [selected, setSelected] = useState(questions[0]);
    const [estNegatif, setEstNegatif] = useState(false);
    const [title, setTitle] = useState('');
    const [listChapitre, setListChapitre] = useState([]);
    const [chapitre, setChapitre] = useState('');
    const [type, setType] = useState(selected.type);
    const [open, setOpen] = useState(false);
    const { errorMessage, errorAnchorEl, id, openAnchor, showErrorPopover, handleClosePopover } = useErrorPopover();
    const navigate = useNavigate()


    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };


    const handleAddQuestion = () => {
        addQuestion(questions, setQuestions);
        console.log(questions)
    };

    const handleAddReponse = () => {
        addReponse(selected, setSelected);
    };


    const handleChangeQuestion = (newQuestion) => {
        console.log(questions)
        changeQuestion(selected, setSelected, setQuestions, showErrorPopover, newQuestion)
    }

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };


    const handleRemoveReponse = (indexToRemove) => {
        removeReponse(indexToRemove, selected, setSelected);
    };


    const handleValidateQuizz = async () => {
        await validateQuizz({
            title,
            chapitre,
            questions,
            estNegatif,
            createQuizz,
            navigate,
            showErrorPopover
        });
    };

    const handleValidateReponse = (indexReponse) => {
        setSelected(prevSelected => validateReponse(prevSelected, indexReponse));
    };

    const handleChangeChapitre = (event) => {
        setChapitre(event.target.value);
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
        typeChange(setSelected, typeQuestion);
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


    return (
        <div className="quizz-background" style={{ backgroundColor: "#C3D9FF", overflow: "auto" }}>
            <div className="container-create-quizz" style={{ display: "flex" }}>
                <QuestionsDrawer
                    open={open}
                    toggleDrawer={toggleDrawer}
                    questions={questions}
                    changeQuestion={handleChangeQuestion}
                    addQuestion={handleAddQuestion}
                />
                <div className="background-create-quizz">
                    <QuizzTitleInput
                        value={title}
                        onChange={handleTitleChange}
                        ariaDescribedBy="title-input-description"
                    />
                    <ChapterSelect
                        value={chapitre}
                        onChange={handleChangeChapitre}
                        listChapitre={listChapitre}
                    />
                    <Textarea
                        variant="plain"
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
                        setEstNegatif={setEstNegatif} />
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

export default CreateQuizz;