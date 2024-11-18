import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { getUe } from "../API/UeAPI.js";
import { getUserInfo } from "../API/ProfileAPI.js";

import "./home.css";
import { IconButton, TextField, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, Box } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import MethodeJ from "./composent/MethodeJ.js";
import StyledButton from "../composent/StyledBouton.js";
import FlashCardsModal from "../flashcards/FlashcardsModal.js";


function Home() {
  const [isSecure] = useState(null);
  const [listUE, setListUE] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [role, setRole] = useState('');

  // Nouveaux états pour la flashcard du jour et pour la modal
  const [dailyFlashcard, setDailyFlashcard] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleListItemClick = (id) => {
    navigate(`/ue/${id}`);
  };

  const handleListItemClickProf = (id) => {
    navigate(`/ueProf/${id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response_info = await getUserInfo();
        setRole(response_info.role);
        if (role === 'etudiant') {
          const response = await getUe();
          setListUE(response);
        }
        else if (role === 'enseignant') {
          setListUE(response_info.ue);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des UE:', error);
      }
    };
    fetchData();
  }, [role]);


  const filteredListUE = listUE.filter(ue =>
    ue.label.toLowerCase().includes(searchQuery)
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.trim().toLowerCase());
  };

  // Simulation d'une liste de flashcards
  const flashcards = [
    { recto: "Question 1", verso: "Réponse 1" },
    { recto: "Question 2", verso: "Réponse 2" },
    { recto: "Question 3", verso: "Réponse 3" },
  ];

  // Génère une flashcard du jour ou la récupère du localStorage
  useEffect(() => {
    const savedFlashcard = JSON.parse(localStorage.getItem('dailyFlashcard'));
    const today = new Date().toDateString();

    if (!savedFlashcard || savedFlashcard.date !== today) {
      const randomFlashcard = flashcards[Math.floor(Math.random() * flashcards.length)];
      const dailyFlashcardWithDate = { ...randomFlashcard, date: today };
      localStorage.setItem('dailyFlashcard', JSON.stringify(dailyFlashcardWithDate));
      setDailyFlashcard(dailyFlashcardWithDate);
    } else {
      setDailyFlashcard(savedFlashcard);
    }
  }, []);

  // Ouvre et ferme la modal de flashcard
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (

    <div className='style_background_esp_ele'>
      {role === 'enseignant' && (
        <div className='container2_style'>
          <Typography sx={{ fontSize: { xs: "2em", sm: "3em", md: "4em" } }}>Espace Professeur</Typography>
          <div className="container-home-prof">
            <h2>Liste Ue :</h2>
            <TextField
              onChange={handleSearchChange}
              sx={{
                width: "90%",
                alignSelf: "center",
                borderRadius: "50px",
                color: '#f5f5f5',
                fontSize: "x-large",
                '& .MuiOutlinedInput-root': {
                  borderRadius: "50px",
                },
                border: 3,
              }}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton><SearchIcon sx={{ width: 40, height: 40 }} /></IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <List sx={{
              width: '100%',
              position: 'relative',
              overflow: "hidden",
              overflowY: "scroll",
              maxHeight: 300,
              '& ul': { padding: 0 },
            }}>
              {filteredListUE && filteredListUE.length > 0 && filteredListUE.map(ue => (
                <ListItem key={ue.id_ue} onClick={() => handleListItemClickProf(ue.id_ue)}>
                  <ListItemAvatar>
                    <Avatar sx={{ width: 56, height: 56, paddingLeft: "20px" }} src={ue.path} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={ue.label}
                    primaryTypographyProps={{ style: { color: '#f5f5f5', fontSize: "x-large", } }}
                  />
                </ListItem>
              ))}
            </List>
          </div>
        </div>
      )}
      {role === 'etudiant' && (
        <div className='container2_style'>
          <Typography sx={{ fontSize: { xs: "2em", sm: "3em", md: "4em" } }}>Espace Eleve</Typography>
          <div className="sub_container_ue_j" style={{ display: "flex", width: "90%", justifyContent: "space-between", height: "70%" }}>
            <div className="sub_container_ue" style={{
              backgroundColor: "#133D56",
              borderRadius: "20px",
              marginBottom: "20px",
              display: "flex",
              flexDirection: "column",
              flex: 1
            }}>
              <h2 style={{ marginLeft: "20px", fontSize: "xx-large", color: "#F5F5F5" }}>Liste d'UE</h2>
              <TextField
                onChange={handleSearchChange}
                sx={{
                  width: "90%",
                  alignSelf: "center",
                  borderRadius: "50px",
                  color: '#f5f5f5',
                  fontSize: "x-large",
                  '& .MuiOutlinedInput-root': {
                    borderRadius: "50px",
                  },
                  border: 3,
                }}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton><SearchIcon sx={{ width: 40, height: 40 }} /></IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <List sx={{
                width: '100%',
                position: 'relative',
                overflow: "hidden",
                overflowY: "scroll",
                maxHeight: 300,
                marginTop: 1, borderTop: 3, borderColor: 'rgb(0 0 0 / 29%)',
                '& ul': { padding: 0 },
              }}>

                {filteredListUE && filteredListUE.length > 0 && filteredListUE.map(ue => (
                  <ListItem key={ue.id_ue} onClick={() => handleListItemClick(ue.id_ue)}>
                    <ListItemAvatar>
                      <Avatar sx={{ width: 56, height: 56 }} src={ue.path} />
                    </ListItemAvatar>
                    <div>
                      {ue && ue.enseignant && ue.enseignant[0] && (
                        <ListItemText
                          primary={ue.enseignant[0].nom + " " + ue.enseignant[0].prenom} // Assurez-vous d'accéder au premier élément
                          primaryTypographyProps={{ style: { color: '#f5f5f5' } }}
                        />
                      )}
                      <ListItemText
                        primary={ue.label}
                        primaryTypographyProps={{ style: { color: '#f5f5f5', fontSize: "x-large" } }}
                      />
                    </div>
                  </ListItem>
                ))}
              </List>
            </div>
            <Box sx={{ display: "flex", flexDirection: "column"}}>
              <MethodeJ />
              <Box sx={{display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                <StyledButton content={"Flashcard du jour"} color={"primary"} onClick={handleOpenModal} />
              </Box>
            </Box>
            <FlashCardsModal
              open={isModalOpen}
              onClose={handleCloseModal}
              flashCardData={dailyFlashcard}
            />
          </div>
          {isSecure}

        </div>
      )}
    </div>

  );
}

export default Home;