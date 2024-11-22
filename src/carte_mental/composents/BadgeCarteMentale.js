import React from 'react';
import { Badge, Tooltip } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';

const BadgeCarteMentale = ({ isOtherUser, userName, children }) => {
  return (
    <Tooltip placement='top' title={isOtherUser ? `Utilisateur : ${userName}` : ''} arrow>
      <Badge
        badgeContent={isOtherUser ? <PeopleIcon fontSize="small" /> : null}
        invisible={!isOtherUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          "& .MuiBadge-badge": {
            backgroundColor: '#133D56', // Couleur de fond personnalisée
            color: '#ffffff', // Couleur du texte ou de l'icône à l'intérieur
            height: "20px", // Taille fixe pour le badge
            minWidth: "20px", // Largeur minimale pour le badge
          },
        }}
      >
        {children}
      </Badge>
    </Tooltip>
  );
};

export default BadgeCarteMentale;
