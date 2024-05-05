import React, { useEffect, useState } from 'react';
import { Select, InputLabel, FormControl, MenuItem, Box, Typography, Popover } from "@mui/material";
import { getCoursParChap, addForum } from './ForumAPI';
import { useNavigate, useParams } from 'react-router-dom';
import StyledButton from '../composent/StyledBouton.js';

const CreateForum = () => {
    const navigate = useNavigate();
    const { id_chap } = useParams();
    const [contenu, setContenu] = useState('');
    const [sujet, setSujet] = useState('');
    const [idCours, setIdCours] = useState('');
    const [cours, setCours] = useState([]);
    const [errorAnchorEl, setErrorAnchorEl] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [id, setId] = useState(undefined);
    const [open, setOpen] = useState(false);


    useEffect(() => {
        const fetchCours = async () => {
            try {
                const data = await getCoursParChap(id_chap);
                setIdCours(data[0].id_cours);
                setCours(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des cours :", error);
            }
        };

        fetchCours();
    }, [id_chap]);

    const handleCreateForum = async () => {

        if (sujet.trim() === '') {
            setErrorMessage('Ce champ est requis!');
            setErrorAnchorEl(document.getElementById('sujet'));
            setId('error-popover');
            setOpen(true);
            return
        } else if (!/^[a-zA-ZÀ-ÿ\s-]*$/.test(sujet)) {
            setErrorMessage('Caractère non autorisé. (Chiffre non autorisé)');
            setErrorAnchorEl(document.getElementById('sujet'));
            setId('error-popover');
            setOpen(true);
            return;
        }
        if (contenu.trim() === '') {
            setErrorMessage('Ce champ est requis!');
            setErrorAnchorEl(document.getElementById('contenu'));
            setId('error-popover');
            setOpen(true);
            return
        }
        try {
            await addForum(sujet, contenu, idCours);
            alert("Forum créé avec succès !");
            navigate(`/etude/${id_chap}`);
        } catch (error) {
            console.error("Erreur lors de la création du forum :", error);
            setErrorMessage('Erreur lors de la création du forum. Veuillez réessayer.');
            setErrorAnchorEl(document.getElementById('sujet'));
            setId('error-popover');
            setOpen(true);
        }
    };


    const handleClosePopover = () => {
        setErrorAnchorEl(null);
        setErrorMessage('');
        setOpen(false);
    };

    const handleChangeContenu = (e) => {
        const value = e.target.value;
        if (value.length > 300) {
          setErrorMessage('Limite de caractère dépassée.');
          setErrorAnchorEl(document.getElementById('contenu'));
          setId('error-popover');
          setOpen(true);
          return;
        }
        setContenu(value);
      };
      

    return (
        <div className='create-forum-container'>
            <h2>Poser une question</h2>
            <div className='create-forum-form-container'>
                <div className='create-forum-form'>
                    <FormControl
                        className='form-control'
                        sx={{ m: 1, width: "80%" }} >

                        <Box display="flex" alignItems="center" width="100%">
                            <Typography
                                sx={{
                                    mr: 1,
                                    width: "45%",
                                    color: 'white',
                                    fontSize: {
                                        xs: "1em",
                                        sm: "1.5em",
                                        md: "2em"
                                    }
                                }}>
                                Cours concernés :
                            </Typography>
                            <Select
                                id='cours_id'
                                value={idCours}
                                onChange={(e) => setIdCours(e.target.value)}
                                sx={{
                                    width: "55%",
                                    borderRadius: "10px",
                                    backgroundColor: "#f0f0f0"
                                }}

                            >
                                {cours.map(cour => (
                                    <MenuItem key={cour.id_cours} value={cour.id_cours}>{cour.label}</MenuItem>
                                ))}
                            </Select>
                        </Box>


                        <Box display="flex" alignItems="center" width="100%">
                            <Typography
                                sx={{
                                    mr: 1,
                                    width: "45%",
                                    color: 'white',
                                    fontSize: {
                                        xs: "1em",
                                        sm: "1.5em",
                                        md: "2em"
                                    }
                                }}
                                className='create-forum-typography'>
                                Sujet :
                            </Typography>
                            <input
                                aria-describedby={id}
                                type="text"
                                id='sujet'
                                className='form-input'
                                value={sujet}
                                onChange={(e) => setSujet(e.target.value)}
                            />

                        </Box>
                        <Box display="flex" alignItems="center" width="100%">
                            <Typography sx={{
                                mr: 1,
                                width: "45%",
                                color: 'white',
                                fontSize: {
                                    xs: "1em",
                                    sm: "1.5em",
                                    md: "2em"
                                }
                            }}
                                className='create-forum-typography'>
                                Question :
                            </Typography>
                            <textarea
                                aria-describedby={id}
                                id='contenu'
                                className='form-textarea'
                                value={contenu}
                                onChange={handleChangeContenu}
                                sx={{
                                    width: {
                                        xs: "100%",  // Plus large sur les petits écrans pour une meilleure accessibilité
                                        sm: "100%",
                                        md: "80%"    // Plus étroit sur les écrans larges
                                    },
                                    fontSize: {
                                        xs: "0.8em",  // Plus petite taille de police sur les petits écrans
                                        sm: "1.2em",
                                        md: "1.5em"   // Taille normale sur les écrans plus larges
                                    },
                                    borderRadius: "20px",
                                    padding: "5px",
                                    border: "1px solid #ccc"
                                }}
                            />
                        </Box>
                        <Box display="flex" alignItems="center" width="100%" justifyContent="center">
                            <StyledButton
                                width={'175px'}
                                content={"Créer le forum"}
                                fontSize={"1em"}
                                onClick={handleCreateForum}
                            />
                        </Box>
                    </FormControl>
                    <Popover
                        id={id}
                        open={open}
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
};

export default CreateForum;
