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
    Typography: 4,
};


function GestionQuizz() {
    const navigate = useNavigate();
    const { idUE } = useParams();
    const [activeTab, setActiveTab] = useState('prof');
    const [quizzes, setQuizzes] = useState([]);
    const [openDelete, setOpenDelete] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [UE, setUE] = useState('');
    const [errorAnchorEl, setErrorAnchorEl] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [listUE, setListUE] = useState([]);
    const [id, setId] = useState(undefined);
    const handleOpenCreate = () => setOpenCreate(true);
    const handleCloseCreate = () => setOpenCreate(false);
    const handleOpenDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);
    const [openPop, setOpenPop] = useState(false);
    const handleOpenPop = () => setOpenPop(true);
    const handleClosePop = () => setOpenPop(false);

    const delQuizz = async (quizId) => {
        try {
            await deleteQuizz(quizId);
            fetchMyQuizz();
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
            <div className='background-quizz-principale-container'>
                <div className='base-container_quizz_principale'>
                <Typography sx={{fontSize: { xs: "2em", sm: "3em", md: "4em" }}} className='quizz-title'>Vos quizzes</Typography>
                <div className='container_quizzs'>
                    {quizzes ? (
                        quizzes.length > 0 ? (
                            quizzes.map(quiz => (
                                <Box sx={{ flexWrap: { lg: 'nowrap', xs: 'wrap' }, height: { lg: '120px', xs: '220px' } }}
                                    key={quiz.id_quizz} className='container_quizz'>
                                    <Box sx={{ height: { md: '75px', sm: '62px', xs: '50px' } }} id='quizz_sujet' className='theme_quizz'>
                                        <Typography sx={{
                                            fontSize: { xs: "0.7em", sm: "1em", md: "1.7em" },
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis"
                                        }}>{quiz.chapitreInfo[0].label}</Typography>
                                    </Box>
                                    <Box sx={{ height: { md: '75px', sm: '62px', xs: '50px' } }} id='quizz_sujet' className='theme_quizz'>
                                        <Typography sx={{
                                            fontSize: { xs: "0.7em", sm: "1em", md: "1.7em" },
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis"
                                        }}>{quiz.label}</Typography>
                                    </Box>
                                    <Box sx={{ height: { md: '75px', sm: '62px', xs: '50px' } }} id='quizz_like' className='quizz_like'>
                                        <Typography sx={{
                                            fontSize: { xs: "0.7em", sm: "1em", md: "1.7em" },
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis"
                                        }}>{quiz.moyenne_note} </Typography>
                                        <img className='img_coeur' src={stars_yellow} alt='like' />
                                    </Box>
                                    <StyledButton
                                        onClick={() => navigate(`/update_quizz/${quiz.id_quizz}`)}
                                        width={200}
                                        color={'white'}
                                        content={"Modifier"}></StyledButton>
                                    <StyledButton
                                        onClick={handleOpenDelete}
                                        width={200}
                                        color={'white'}
                                        content={"Supprimer"}></StyledButton>
                                    <Modal
                                        open={openDelete}
                                        onClose={handleCloseDelete}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Box sx={style}>
                                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                                Voulez vous vraiment supprimer le quizz?
                                            </Typography>
                                            <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
                                                <StyledButton
                                                    onClick={() => { delQuizz(quiz.id_quizz); handleCloseDelete(); }}
                                                    width={100}
                                                    color={'primary'}
                                                    content={"Oui"} />
                                                <StyledButton
                                                    onClick={handleCloseDelete}
                                                    width={100}
                                                    color={'primary'}
                                                    content={"Non"} />
                                            </Box>
                                        </Box>
                                    </Modal>

                                </Box>
                            ))
                        ) : <Typography>Aucun quizz disponible.</Typography>
                    ) : <Typography>Aucun quizz disponible</Typography>}
                </div>
                <StyledButton
                    onClick={handleOpenCreate}
                    color={'primary'}
                    content={"Creer un quizz"} ></StyledButton>
                <Modal
                    open={openCreate}
                    onClose={handleCloseCreate}
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

                    </Box>
                </Modal>
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
                    <Typography sx={{ Typography: 2 }}>{errorMessage}</Typography>
                </Popover>
            </div>
        </div>
        </div>
    );
}

export default GestionQuizz;
