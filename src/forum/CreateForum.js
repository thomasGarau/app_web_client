import React, { useEffect, useState } from 'react';
import { Select, InputLabel, FormControl, MenuItem, Modal, Box, Typography } from "@mui/material"
import { getCoursParChap } from './ForumAPI';
import { useParams } from 'react-router-dom';

const CreateForum = () => {
    const { id_chap } = useParams();
    const [contenu, setContenu] = useState('');
    const [sujet, setSujet] = useState('');
    const [id, setId] = useState(1);
    const [idCours, setIdCours] = useState('');
    const [cours, setCours] = useState([]);

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
        // Logique de création du forum
    };

    return (
        <div className='create-forum-container'>
            <h2>Poser une question</h2>
            <div className='create-forum-form'>
                <FormControl className='form-control' sx={{ m: 1, width: "60%" }}>
                    <Box display="flex" alignItems="center">
                        <Typography sx={{ mr: 1, width: "30%" }}>Cours concernés :</Typography>
                        <Select
                            id='cours_id'
                            value={idCours}
                            onChange={(e) => setIdCours(e.target.value)}
                            sx={{
                                width: "100%",
                                borderRadius: "10px",
                                backgroundColor: "#f0f0f0"
                            }}
                        >
                            {cours.map(cour => (
                                <MenuItem key={cour.id_cours} value={cour.id_cours}>{cour.label}</MenuItem>
                            ))}
                        </Select> 
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Typography sx={{ mr: 1, width: "30%" }}>Sujet :</Typography>
                        <textarea
                            id='sujet'
                            value={sujet}
                            onChange={(e) => setSujet(e.target.value)}
                            sx={{
                                width: "100%",
                                borderRadius: "10px",
                                backgroundColor: "#f0f0f0"
                            }}
                        />
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Typography sx={{ mr: 1, width: "30%" }}>Question :</Typography>
                        <textarea
                            id='contenu'
                            value={contenu}
                            onChange={(e) => setContenu(e.target.value)}
                            sx={{
                                width: "100%",
                                borderRadius: "10px",
                                backgroundColor: "#f0f0f0"
                            }}
                        />
                    </Box>
                    <Box display="flex" justifyContent="center">
                        <button
                            className='btn-create-forum'
                            onClick={handleCreateForum}
                            sx={{
                                width: "100%",
                                borderRadius: "10px",
                                backgroundColor: "#f0f0f0"
                            }}
                        >
                            Créer le forum
                        </button>
                    </Box>
                </FormControl>
            </div>
        </div>
    );
};

export default CreateForum;
