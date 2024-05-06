import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "@fontsource/nanum-pen-script";
import stars_yellow from './img/star_full.png';
import { getTokenAndRole } from '../services/Cookie.js';
import { getQuizzParChap, getQuestionParQUizz, getListQuizzCreateForUser, deleteQuizz, getQuizzInfo, getChapitreById, noteMoyennePourQuizz } from './QuizzAPI.js';
import './Quizz.css';
import StyledButton from '../composent/StyledBouton.js';
import { Box, FormControl, InputLabel, MenuItem, Modal, Popover, Select, Typography } from '@mui/material';
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
    const [errorAnchorEl, setErrorAnchorEl] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [listUE, setListUE] = useState([]);
    const [id, setId] = useState(undefined);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [openPop, setOpenPop] = useState(false);
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

    const handleToCreateQuizz = async () => {
        console.log("UE : ", UE);
        if (UE === '') {
            setErrorMessage('Vous n\'avez pas sélectionné d\'UE!');
            setErrorAnchorEl(document.getElementById('label-ue'));
            setId('error-popover');
            setOpenPop(true);
            return
        }
        navigate(`/create_quizz/${UE.id_ue}`);
    };


    const fetchMyQuizz = async () => {
        try {
            const quizzs = await getListQuizzCreateForUser();
            console.log("quizzs : ", quizzs);
            const enhancedQuizzs = await Promise.all(quizzs.map(async (quizz) => {
                const chapitreInfo = await getChapitreById(quizz.id_chapitre);
                const note_moyenne = parseFloat(quizz.moyenne_note).toFixed(1);
                console.log("note_moyenne : ", note_moyenne);
                return { ...quizz, chapitreInfo, moyenne_note: note_moyenne };
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

    const handleClosePopover = () => {
        setErrorAnchorEl(null);
        setErrorMessage('');
        setOpenPop(false);
    };


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
                                        <p>{quiz.moyenne_note} </p>
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
                            <InputLabel id="label-ue">UE</InputLabel>
                            <Select
                                sx={{
                                    width: "100%",
                                    borderRadius: "10px",
                                    backgroundColor: "#f0f0f0"
                                }}
                                labelId="label-ue"
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
                                onClick={handleToCreateQuizz} />
                        </FormControl>
                        <Popover
                            id={id}
                            open={openPop}
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
                    </Box>
                </Modal>
            </div>
        </div>
    );
}

export default GestionQuizz;
