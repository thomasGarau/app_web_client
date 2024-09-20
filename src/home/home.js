import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { getJMethod } from "../API/jMethodeAPI.js";
import { getUe } from "../API/UeAPI.js";
import { getUserInfo } from "../API/ProfileAPI.js";
import { getTokenAndRole } from "../services/Cookie.js";

import "./home.css";
import { IconButton, TextField, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { DateCalendar, DayCalendarSkeleton } from '@mui/x-date-pickers';
import { decodeJWT } from "../services/decode.js";
import ServerDay from "./ServerDay.js";


function Home() {
  const requestAbortController = useRef(null);
  const [isSecure] = useState(null);
  const [listUE, setListUE] = useState([]);
  const [listJMethod, setListJMethod] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth());
  const [role, setRole] = useState('');

  const handleListItemClick = (id) => {
    navigate(`/ue/${id}`);
  };

  const handleListItemClickProf = (id) => {
    navigate(`/ueProf/${id}`);
  };

  function importAll(r) {
    let images = {};
    r.keys().forEach((item, index) => { images[item.replace('./', '')] = r(item); });
    return images
  }


  const fetchJMethod = async () => {
    setIsLoading(true);
    const controller = new AbortController();
    try {
      const { token, role } = await getTokenAndRole();
      const tokenInfo = decodeJWT(token);
      if (tokenInfo.consentement === 1) {
        try {
          const JMethod = await getJMethod();
          console.log(JMethod);
          setListJMethod(JMethod);
          requestAbortController.current = controller;
        } catch (error) {
          console.error('Erreur lors de la méthode des J:', error);
        }
      }
    }
    catch (error) {
      console.error('Erreur lors de la récupération du token :', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const filteredDates = listJMethod
      .filter(JMethod => new Date(JMethod.date).getMonth() === month)
      .map(JMethod => new Date(JMethod.date));

    const days = filteredDates.map(date => date.getDate());
    setHighlightedDays(days);

    return () => {
      requestAbortController.current?.abort();
    };
  }, [listJMethod, month]);



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
      fetchJMethod();
    };
    fetchData();
  }, [role]);


  useEffect(() => {
    fetchJMethod(month);
    return () => requestAbortController.current?.abort();
  }, [month]);

  const handleMonthChange = (date) => {
    setMonth(date.$M)
    fetchJMethod(date.$M);
  };



  const filteredListUE = listUE.filter(ue =>
    ue.label.toLowerCase().includes(searchQuery)
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.trim().toLowerCase());
  };

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
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Typography style={{ fontFamily: "Shadows Into Light", fontSize: "xx-large" }}>Methode des j</Typography>
              <DateCalendar
                sx={{ width: { xs: "250px", lg: "330px", md: "100%", sm: "100%" }, margin: { sm: "0px 20px" }, height: "100%" }}
                loading={isLoading}
                onMonthChange={handleMonthChange}
                renderLoading={() => <DayCalendarSkeleton />}
                slots={{
                  day: ServerDay,
                }}
                slotProps={{
                  day: {
                    highlightedDays,
                    listJMethod,
                  },
                }}
              />

            </div>
          </div>
          {isSecure}

        </div>
      )}
    </div>

  );
}

export default Home;