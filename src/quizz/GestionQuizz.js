import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "@fontsource/nanum-pen-script";
import { getListQuizzCreateForUser, deleteQuizz } from '../API/QuizzAPI.js';
import { getChapitreById } from '../API/CoursAPI.js';
import './Quizz.css';
import StyledButton from '../composent/StyledBouton.js';
import { Box, FormControl, InputLabel, MenuItem, Modal, Popover, Select, Typography } from '@mui/material';
import { getUe } from '../API/UeAPI.js';
import useErrorPopover from '../composent/useErrorPopover.js';
import { delQuizz, fetchMyQuizz } from './quizz_services/GestionQuizzService.js';
import { QuizList } from './gestion_quizz_components/QuizList.js';
import { CreateModal } from './gestion_quizz_components/CreateModal.js';
import PopoverError from '../composent/PopoverError.js';


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
    const [quizzes, setQuizzes] = useState([]);
    const [openDelete, setOpenDelete] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [UE, setUE] = useState('');
    const [listUE, setListUE] = useState([]);
    const handleOpenCreate = () => setOpenCreate(true);
    const handleCloseCreate = () => setOpenCreate(false);
    const handleOpenDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);

    const { errorMessage, errorAnchorEl, id, openAnchor, showErrorPopover, handleClosePopover } = useErrorPopover();

    const handleDelQuizz = async (quizId) => {
        delQuizz(
            quizId,
            fetchMyQuizz(setQuizzes, setListUE)
        )
    };

    const handleChangeUE = (event) => {
        setUE(event.target.value);
    };

    const handleToCreateQuizz = async () => {
        if (UE === '') {
            showErrorPopover('Vous n\'avez pas sélectionné d\'UE!', 'label-ue')
            return
        }
        navigate(`/create_quizz/${UE.id_ue}`);
    };

    useEffect(() => {
        fetchMyQuizz(setQuizzes, setListUE);
    }, []);


    return (
        <div className='background_quizz_principale'>
            <div className='background-quizz-principale-container'>
                <div className='base-container_quizz_principale'>
                    <Typography sx={{ fontSize: { xs: "2em", sm: "3em", md: "4em" } }} className='quizz-title'>Vos quizzes</Typography>
                    <QuizList
                        quizzes={quizzes}
                        navigate={navigate}
                        handleOpenDelete={handleOpenDelete}
                        handleDelQuizz={handleDelQuizz}
                        handleCloseDelete={handleCloseDelete}
                        openDelete={openDelete}
                        style={style}
                    ></QuizList>
                    <StyledButton
                        onClick={handleOpenCreate}
                        color={'primary'}
                        content={"Creer un quizz"} ></StyledButton>
                    <CreateModal
                        open={openCreate}
                        handleClose={handleCloseCreate}
                        UE={UE}
                        listUE={listUE}
                        handleChangeUE={handleChangeUE}
                        handleToCreateQuizz={handleToCreateQuizz}
                        style={style}
                    ></CreateModal>
                    <PopoverError
                        id={id}
                        open={openAnchor}
                        anchorEl={errorAnchorEl}
                        onClose={handleClosePopover}
                        errorMessage={errorMessage}
                    />
                </div>
            </div>
        </div>
    );
}

export default GestionQuizz;
