import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { getJMethod, getUe } from "./homeAPI.js";
import { logout } from "../connexion/UserAPI.js";
import { eraseCookie, getTokenAndRole } from "../services/Cookie.js";

import "./home.css";
import { Badge, IconButton, TextField, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, Box, Modal } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { DateCalendar, DayCalendarSkeleton, PickersDay } from '@mui/x-date-pickers';


const style = {
  position: 'absolute',
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

function ServerDay(props) {
  const { highlightedDays = [], listJMethod = [], day, outsideCurrentMonth, ...other } = props;
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  }
  const handleClose = () => setOpen(false);
  const [isSelected, setIsSelected] = useState(false);
  const [JMethod, setJMethod] = useState();


  useEffect(() => {
    setIsSelected(!outsideCurrentMonth && highlightedDays.includes(day.$D));
    setJMethod(listJMethod.filter(JMethod => highlightedDays.includes(new Date(JMethod.date).getDate())));
  }, [listJMethod, outsideCurrentMonth, highlightedDays, day.$D]);


  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={isSelected ? '🌚' : undefined}
    >
      <PickersDay onClick={isSelected ? handleOpen : null} {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
      {isSelected ? <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {JMethod.length > 0 ? `UE à réviser: ${JMethod[0].label}` : ''}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {JMethod.length > 0 ? `Heure à réviser: ${JMethod[0].duree}` : ''}
          </Typography>

        </Box>
      </Modal> : ""}
    </Badge>
  );
}


function Home() {
  const requestAbortController = useRef(null);
  const [isSecure] = useState(null);
  const [listUE, setListUE] = useState(null)
  const [listJMethod, setListJMethod] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth());

  const handleListItemClick = (id) => {
    navigate(`/ue/${id}`);
  };


  function importAll(r) {
    let images = {};
    r.keys().forEach((item, index) => { images[item.replace('./', '')] = r(item); });
    return images
  }
  const images = importAll(require.context('../ueIcons', false, /\.(png|jpe?g|svg)$/));


  const fetchJMethod = async (month) => {
    setIsLoading(true);
    const controller = new AbortController();
    try {
      const JMethod = await getJMethod();
      setListJMethod(JMethod);
      requestAbortController.current = controller;
    } catch (error) {
      console.error('Erreur lors de la méthode des J:', error);
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
    const fetchUeData = async () => {
      try {
        const ueData = await getUe();
        setListUE(ueData);
      } catch (error) {
        console.error('Erreur lors de la récupération des UE:', error);
      }
    };
    fetchJMethod(month);
    fetchUeData();
  }, [month]);

  useEffect(() => {
    fetchJMethod(month);
    return () => requestAbortController.current?.abort();
  }, [month]);

  const handleMonthChange = (date) => {
    setMonth(date.$M)
    fetchJMethod(date.$M);
  };

  async function handleDisconnection() {
    try {
      const { token, role } = getTokenAndRole();
      await logout(token)
      eraseCookie();
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
      throw error;
    } finally {
      navigate('/');
    }
  }

  const filteredListUE = listUE ? listUE.filter(ue =>
    ue.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ue.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ue.label.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];


  return (
    <div className='style_background_esp_ele'>
      <div className='container2_style'>
        <h1 style={{ fontSize: "xxx-large" }}>Espace Eleve</h1>
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
              onChange={(e) => setSearchQuery(e.target.value)}
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
                <ListItem style={{ marginLeft: "10px" }} key={ue.id_ue}
                  onClick={() => handleListItemClick(ue.id_ue)}>
                  <ListItemAvatar>
                    <Avatar sx={{ width: 56, height: 56 }} src={images[ue.icon]} />
                  </ListItemAvatar>
                  <div>
                    <ListItemText
                      primary={ue.enseignant[0].nom + " " + ue.enseignant[0].prenom} // Assurez-vous d'accéder au premier élément
                      primaryTypographyProps={{ style: { color: '#f5f5f5' } }}
                    />
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
        <button onClick={handleDisconnection}>Deconnexion</button>
      </div>
    </div>

  );
}

export default Home;