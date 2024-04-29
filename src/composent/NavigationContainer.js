import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { IconButton, Drawer, Button } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import "./NavigationContainer.css"

function NavigationContainer({ children }) {

    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    return (
        <div className="base-container">
            <IconButton className="menu-button" onClick={toggleDrawer(true)}><MenuRoundedIcon /></IconButton>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                <div style={{ backgroundColor: "#f5f5f5" }}>
                    <Button>
                        Acceuil
                    </Button>
                    <Button>
                        Profil
                    </Button>
                    <Button>
                        Etude
                    </Button>
                </div>
            </Drawer>
            {children}
        </div>
    )
} export default NavigationContainer;