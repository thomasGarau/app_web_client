import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { testSecure } from "./securePageAPI.js";
import { logout } from "../connexion/UserAPI.js";
import { eraseCookie, getTokenAndRole } from "../services/Cookie.js";
import "./securePage.css";
import Header from "../composent/Header.js";
import { Button, IconButton, TextField, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, Avatar } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';


function SecurePage() {
  const [isSecure, setIsSecure] = useState(null);
  const [listUE, setListUE] = useState([
    { id: 0, icon: "python.png", prof: { nom: "Bisgambiglia", prenom: "Paul-Antoine" }, ue: "Python" },
    { id: 1, icon: "github.png", prof: { nom: "Filippi", prenom: "Jean-Baptiste" }, ue: "Github" },
    { id: 2, icon: "github.png", prof: { nom: "Filippi", prenom: "Jean-Baptiste" }, ue: "Github" }])
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  function importAll(r) {
    let images = {};
    r.keys().forEach((item, index) => { images[item.replace('./', '')] = r(item); });
    return images
  }
  const images = importAll(require.context('../ueIcons', false, /\.(png|jpe?g|svg)$/));

  useEffect(() => {
    const fetchSecureData = async () => {
      try {
        const { token, role } = await getTokenAndRole();
        const response = await testSecure(token, role);
        setIsSecure(response);
      } catch (error) {
        console.error('Erreur lors de la récupération des données sécurisées:', error);
      }
    };

    fetchSecureData();
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

  const filteredListUE = listUE.filter(ue =>
    ue.prof.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ue.prof.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ue.ue.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              {filteredListUE.map(ue => (
                <ListItem style={{ marginLeft: "10px" }} key={ue.id}>
                  <ListItemAvatar>
                    <Avatar sx={{ width: 56, height: 56 }} src={images[ue.icon]} />
                  </ListItemAvatar>
                  <div>
                    <ListItemText
                      primary={ue.prof.nom + " " + ue.prof.prenom}
                      primaryTypographyProps={{ style: { color: '#f5f5f5', fontFamily: "Nanum Pen Script" } }}
                    />
                    <ListItemText
                      primary={ue.ue}
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