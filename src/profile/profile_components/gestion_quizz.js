import React, { useState, useEffect } from "react";
import { Select, InputLabel, FormControl, MenuItem, Popover, Typography } from "@mui/material";
import StyledButton from "../../composent/StyledBouton";
import { getListQuizzStatForUser } from "../../API/QuizzAPI";
import { getUserInfo } from "../../API/ProfileAPI";
import { useNavigate } from "react-router-dom";
import '../Profile.css';

export default function GestionQuizz() {
    const [user, setUser] = useState('')
    const [listQuizz, setListQuizz] = useState([]);
    const [quizz, setQuizz] = useState('');
    const [errorAnchorEl, setErrorAnchorEl] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [id, setId] = useState(undefined);
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    const handleChangeQuizz = (event) => {
        setQuizz(event.target.value);
    };

    const toStatQuizz = () => {
        if (quizz === '') {
            setErrorMessage('Vous n\'avez pas sélectionné de quizz!');
            setErrorAnchorEl(document.getElementById('label-quizz'));
            setId('error-popover');
            setOpen(true);
            return;
        }
        navigate(`/statQuizz/${quizz.id_quizz}/${quizz.id_note_quizz}`);
    };

    const toGestionQuizz = () => {

        navigate(`/gestion_quizz`);

    }

    const toGestionQuizzProf = () => {
        navigate(`/gestion_quizz/prof`);
    }

    useEffect(() => {
        const fetchListQuizz = async () => {
            try {
                const quizzs = await getListQuizzStatForUser();
                setListQuizz(quizzs);
            } catch (error) {
                console.error('Erreur lors de la récupération des quizz:', error);
            }
        };
        const fetchUserInfo = async () => {
            try {
                const user = await getUserInfo();
                setUser(user);
                setRole(user.role);
            } catch (error) {
                console.error('Erreur lors de la récupération des informations utilisateurs:', error);
            }
        };
        fetchListQuizz();
        fetchUserInfo();
    }, [])

    const handleClosePopover = () => {
        setErrorAnchorEl(null);
        setErrorMessage('');
        setOpen(false);
    };

    return (
        <div className="gestion_quizz_profile_container">
            {listQuizz.length > 0 && (
                <FormControl className="profile-select" sx={{ m: 1, width: "60%", alignItems: "center" }}>
                    <InputLabel id="label-quizz">Statistiques des quizz</InputLabel>
                    <Select
                        sx={{ width: "100%", borderRadius: "10px", backgroundColor: "#f0f0f0" }}
                        labelId="label-quizz"
                        value={quizz}
                        onChange={handleChangeQuizz}
                    >
                        {listQuizz.map((quizz, index) => (
                            <MenuItem key={index} value={quizz}>
                                {quizz.label}
                            </MenuItem>
                        ))}
                    </Select>

                    <StyledButton content={"Selectionner"} color={"primary"} onClick={toStatQuizz} />
                </FormControl>
            )}
            {role === 'etudiant' && (
                <StyledButton
                    content={"Gestion de vos quizz"}
                    color={"primary"}
                    onClick={toGestionQuizz} />
            )}
            {role === 'enseignant' && (
                <StyledButton
                    content={"Gestion de vos quizz"}
                    color={"primary"}
                    onClick={toGestionQuizzProf} />
            )}
            <Popover
                id={id}
                open={open}
                anchorEl={errorAnchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Typography sx={{ p: 2 }}>{errorMessage}</Typography>
            </Popover>
        </div>
    );
}
