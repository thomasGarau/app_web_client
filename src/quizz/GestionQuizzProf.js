import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "@fontsource/nanum-pen-script";
import './Quizz.css';
import StyledButton from '../composent/StyledBouton.js';
import { Typography } from '@mui/material';
import QuestionForum from '../composent/QuestionForum.js';
import useErrorPopover from '../composent/useErrorPopover.js';
import { delQuizz, fetchMyQuizz } from './quizz_services/GestionQuizzService.js';
import { QuizList } from './gestion_quizz_components/QuizList.js';
import { CreateModal } from './gestion_quizz_components/CreateModal.js';
import {  useSelector } from 'react-redux';

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


function GestionQuizzProf() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [idUe, setIdUe] = useState('');
    const [quizzes, setQuizzes] = useState([]);
    const [listUE, setListUE] = useState([]);
    const [UE, setUE] = useState('');
    const [openCreate, setOpenCreate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const handleOpenDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);
    const handleOpenCreate = () => setOpenCreate(true);
    const handleCloseCreate = () => setOpenCreate(false);

    const { errorMessage, errorAnchorEl, idEl, openAnchor, showErrorPopover, handleClosePopover } = useErrorPopover();

    const showForumState = useSelector(state => state.forum.showForum);
    const forumId = useSelector(state => state.forum.forumId);

    const handleDelQuizz = async (quizId) => {
        delQuizz(
            quizId,
            fetchMyQuizz(setQuizzes, setListUE, setIdUe, id)
        )
    };

    const handleChangeUE = (event) => {
        setUE(event.target.value);
    };

    const handleToCreateQuizz = async () => {
        navigate(`/create_quizz/${idUe}`);
    };

    const handleToCreateQuizzAll = async () => {
        if (UE === '') {
            showErrorPopover('Vous n\'avez pas sélectionné d\'UE!', 'label-ue')
            return
        }
        navigate(`/create_quizz/${UE.id_ue}`);
    }

    useEffect(() => {
        fetchMyQuizz(setQuizzes, setListUE, setIdUe, id);
    }, [id]);



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
                    {id && (
                        <StyledButton
                            onClick={handleToCreateQuizz}
                            color={'primary'}
                            content={"Creer un quizz"} ></StyledButton>
                    )}
                    {!id && (
                        <div>
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
                                handleToCreateQuizz={handleToCreateQuizzAll}
                                errorAnchorEl={errorAnchorEl}
                                idEl={idEl}
                                openAnchor={openAnchor}
                                errorMessage={errorMessage}
                                handleClosePopover={handleClosePopover}
                                style={style}
                            ></CreateModal>
                        </div>
                    )}
                </div>

                {showForumState && (
                    <QuestionForum id_quizz={forumId} />
                )}
            </div>
        </div>
    );
}

export default GestionQuizzProf;
