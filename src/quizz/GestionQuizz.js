import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "@fontsource/nanum-pen-script";
import stars_yellow from './img/star_full.png';
import { getTokenAndRole } from '../services/Cookie.js';
import { getQuizzParChap, getQuestionParQUizz, getListQuizzCreateForUser, deleteQuizz, getQuizzInfo, getChapitreById, noteMoyennePourQuizz } from './QuizzAPI.js';
import './Quizz.css';
import StyledButton from '../composent/StyledBouton.js';
import { Box, FormControl, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material';
import { getUe } from '../home/homeAPI.js';


const style = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
};


function GestionQuizz() {
    const navigate = useNavigate();
    const { idUE } = useParams();
    const [activeTab, setActiveTab] = useState('prof');
    const [quizzes, setQuizzes] = useState([]);
    const [open, setOpen] = useState(false);
    const [UE, setUE] = useState('');
    const [listUE, setListUE] = useState([]);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [open2, setOpen2] = useState(false);
    const handleOpen2 = () => setOpen(true);
    const handleClose2 = () => setOpen(false);

    const delQuizz = async (quizId) => {
        try {
            await deleteQuizz(quizId);
        } catch (error) {
            console.error('Erreur lors de la suppression du quizz:', error);
        }
    };

    const handleChangeUE = (event) => {
        setUE(event.target.value);
        console.log(UE)
    };


    const fetchMyQuizz = async () => {
        try {
            const quizzs = await getListQuizzCreateForUser();
            console.log("quizzs : ", quizzs);
            const enhancedQuizzs = await Promise.all(quizzs.map(async (quizz) => {
                const chapitreInfo = await getChapitreById(quizz.id_chapitre);
                let quizzNote = 0; // Initialiser la note du chapitre à 0 par défaut
                try {
                    const note = await noteMoyennePourQuizz(quizz.id_quizz);
                    console.log("note : ", note);
                    quizzNote = parseFloat(note.noteMoyenne.toFixed(1));
                } catch (error) {
                    console.error('Erreur lors de la récupération de la note moyenne du quizz:', error);
                }
                return { ...quizz, chapitreInfo, quizzNote };
            }));
            console.log("enhancedQuizzs : ", enhancedQuizzs);
            setQuizzes(enhancedQuizzs);
            const ues = await getUe();
            setListUE(ues);
            console.log("ues : ", ues);
        } catch (error) {
            console.error('Erreur lors de la récupération des quizz:', error);
        }
    };


    const toCreateQuizz = (id) => {
        console.log("id : ", UE);
        console.log("id : ", id);
        //navigate(`/create_quizz/${id}`);

    };

    useEffect(() => {
        fetchMyQuizz();
    }, []);

    return (
        <div className='background_quizz_principale'>
            <div className='base-container_quizz_principale'>
                <h1 className='quizz-title'>Vos quizzes</h1>
                <div className='container_quizzs'>
                    {quizzes ? (
                        quizzes.length > 0 ? (
                            quizzes.map(quiz => (
                                <div key={quiz.id_quizz} className='container_quizz'>
                                    <div id='quizz_sujet' className='theme_quizz'>
                                        <p>{quiz.chapitreInfo[0].label}</p>
                                    </div>
                                    <div id='quizz_sujet' className='theme_quizz'>
                                        <p>{quiz.label}</p>
                                    </div>
                                    <div id='quizz_like' className='quizz_like'>
                                        <p>{quiz.quizzNote} </p>
                                        <img className='img_coeur' src={stars_yellow} alt='like' />
                                    </div>
                                    <StyledButton
                                        onClick={() => navigate(`/update_quizz/${quiz.id_quizz}`)}
                                        width={'200px'}
                                        color={'white'}
                                        content={"Modifier"}></StyledButton>
                                    <StyledButton
                                        onClick={handleOpen}
                                        width={'200px'}
                                        color={'white'}
                                        content={"Supprimer"}></StyledButton>
                                    <Modal
                                        open={open}
                                        onClose={handleClose}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Box sx={style}>
                                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                                Voulez vous vraiment supprimer le quizz?
                                            </Typography>
                                            <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
                                                <StyledButton
                                                    onClick={() => { delQuizz(quiz.id_quizz); handleClose(); }}
                                                    width={'75px'}
                                                    color={'primary'}
                                                    content={"Oui"} />
                                                <StyledButton
                                                    onClick={handleClose}
                                                    width={'75px'}
                                                    color={'primary'}
                                                    content={"Non"} />
                                            </Box>
                                        </Box>
                                    </Modal>

                                </div>
                            ))
                        ) : <p>Aucun quizz disponible.</p>
                    ) : <p>Aucun quizz disponible</p>}
                </div>
                <StyledButton
                    onClick={handleOpen2}
                    color={'primary'}
                    content={"Creer un quizz"} ></StyledButton>
                <Modal
                    open={open}
                    onClose={handleClose2}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Choississez une UE
                        </Typography>
                        <FormControl className="profile-select" sx={{ m: 1, width: "60%", alignItems: "center" }}>
                            <InputLabel id="label-quizz">UE</InputLabel>
                            <Select
                                sx={{
                                    width: "100%",
                                    borderRadius: "10px",
                                    backgroundColor: "#f0f0f0"
                                }}
                                labelId="label-quizz"
                                id="demo-simple-select"
                                value={UE}
                                label="UE"
                                onChange={handleChangeUE}
                            >
                                {listUE && listUE.map((ue, index) => (
                                    <MenuItem key={index} value={ue}>
                                        {ue.label}
                                    </MenuItem>
                                ))}
                            </Select>

                            <StyledButton
                                content={"Creer le quizz"}
                                width={"90%"}
                                color={"primary"}
                                onClick={() => navigate(`/create_quizz/${UE.id_ue}`)} />
                        </FormControl>
                    </Box>
                </Modal>
            </div>
        </div>
    );
}

export default GestionQuizz;
