import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getUe } from "./securePageAPI.js";
import { logout } from "../connexion/UserAPI.js";
import { eraseCookie, getTokenAndRole } from "../services/Cookie.js";
import "./securePage.css";
import Header from "../composent/Header.js";
import { Button, IconButton, TextField, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, Avatar } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';


function SecurePage() {
  const [isSecure, setIsSecure] = useState(null);
  const [listUE, setListUE] = useState(null)
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleListItemClick = (id) => {
    navigate(`/ue/${id}`);
  };
  

  function importAll(r) {
    let images = {};
    r.keys().forEach((item, index) => { images[item.replace('./', '')] = r(item); });
    return images
  }
  const images = importAll(require.context('../ueIcons', false, /\.(png|jpe?g|svg)$/));

  useEffect(() => {
    const fetchUeData = async () => {
      try {
        const {token, role} = getTokenAndRole();
          const ueData = await getUe();
          setListUE(ueData);
      } catch (error) {
          console.error('Erreur lors de la récupération des UE:', error);
      }
    };

    fetchUeData();
  }, []);

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
          }}>
            <h2 style={{ marginLeft: "20px", fontSize: "xx-large", color: "#F5F5F5" }}>Liste d'UE</h2>
            <TextField
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: "90%",
                alignSelf: "center",
                borderRadius: "50px",
                color: '#f5f5f5',
                fontFamily: "Nanum Pen Script",
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
              overflow: 'auto',
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
                      primary={ue.label + " " + ue.label}
                      primaryTypographyProps={{ style: { color: '#f5f5f5', fontFamily: "Nanum Pen Script" } }}
                    />
                    <ListItemText
                      primary={ue.label}
                      primaryTypographyProps={{ style: { color: '#f5f5f5', fontFamily: "Nanum Pen Script", fontSize: "x-large" } }}
                    />
                  </div>
                </ListItem>
              ))}
            </List>

          </div>
          <div>
            <h2 style={{ fontSize: "xx-large" }}>Methode des j</h2>
            <>{/* Il y aura un calendrier ici !!! */}</>
          </div>
        </div>
        {isSecure}
        <Button variant="contained" onClick={handleDisconnection}>Deconnexion</Button>
      </div>
    </div>

  );
}

export default SecurePage;