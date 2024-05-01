import React, { useState, useRef } from "react";
import Header from "../composent/Header";
import './Profile.css'
import { Select, InputLabel, FormControl, MenuItem, Modal, Box, Typography } from "@mui/material";
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import CakeIcon from '@mui/icons-material/Cake';
import ppImage from '../composent/img/pp.png';
import StyledButton from "../composent/StyledBouton";

export default function Profile() {
    const [user, setUser] = useState({ nom: "Garau", prenom: "Thomas", formation: "Master 1 DFS a Corte", anniversaire: "01/06/2001" })
    const [listQuizz, setListQuizz] = useState(["Quizz1", "Quizz2", "Quizz3"])
    const [listQCM, setListQCM] = useState(["QCM1", "QCM2", "QCM3"])
    const [quizz, setQuizz] = useState("")
    const [QCM, setQCM] = useState("")
    const [profilePic, setProfilePic] = useState(ppImage)
    const [imagePreviewUrl, setImagePreviewUrl] = useState(ppImage)

    const fileInputRef = useRef(null);

    const handleChangeQuizz = (event) => {
        setQuizz(event.target.value);
    };

    const handleUpload = () => {
        fileInputRef.current.click();
    };

    const handleChangeQCM = (event) => {
        setQCM(event.target.value);
    };

    const photoUpload = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(file);
                setImagePreviewUrl(reader.result);
            }
            reader.readAsDataURL(file);
        }
    }


    return (
        <div className='style-background-profile'>
            <div className="user-container">
                <h1 className="hello">BONJOUR {user.nom} {user.prenom}!</h1>
                <div className="div-formation">
                    <HomeRepairServiceIcon fontSize="large" />
                    <span className="formation-text">Formation: {user.formation}</span>
                </div>
                <div className="div-formation">
                    <CakeIcon fontSize="large" />
                    <span className="formation-text">Naissance: {user.anniversaire}</span>
                </div>
            </div>
            <div className="change-profile">
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={photoUpload}
                />
                <img
                    className="pp-change-profile"
                    src={imagePreviewUrl}
                    alt="pp"
                />
                <StyledButton
                    width={'200px'}
                    content={"Modifier"}
                    color={"primary"}
                    onClick={handleUpload}
                />
            </div>
            <FormControl className="profile-select" sx={{ m: 1, width: "60%", alignItems: "center" }}>
                <InputLabel id="label-quizz">Statistiques des quizz</InputLabel>
                <Select
                    sx={{
                        width: "100%",
                        borderRadius: "10px",
                        backgroundColor: "#f0f0f0"
                    }}
                    labelId="label-quizz"
                    id="demo-simple-select"
                    value={quizz}
                    label="aaaaaaaaaaaaaaaaaaaaaa"
                    onChange={handleChangeQuizz}
                >
                    {listQuizz.map((quizz, index) => (
                        <MenuItem key={index} value={quizz}>
                            {quizz}
                        </MenuItem>
                    ))}
                </Select>

                <StyledButton
                    content={"Selectionner"}
                    width={"60%"}
                    color={"primary"} />
            </FormControl>
            <FormControl className="profile-select" sx={{ m: 1, alignItems: "center", width: "60%" }}>
                <InputLabel id="label-qcm">Gestion des QCM</InputLabel>
                <Select
                    sx={{
                        width: "100%",
                        borderRadius: "10px",
                        backgroundColor: "#f0f0f0"
                    }}
                    labelId="label-qcm"
                    id="demo-simple-select"
                    value={QCM}
                    label="aaaaaaaaaaaaaaaaa"
                    onChange={handleChangeQCM}
                >
                    {listQCM.map((qcm, index) => (
                        <MenuItem key={index} value={qcm}>
                            {qcm}
                        </MenuItem>
                    ))}
                </Select>
                <StyledButton
                    content={"Selectionner"}
                    width={"60%"}
                    color={"primary"} />
            </FormControl>
        </div>
    )

}
