import React from 'react';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';

const MaterialUISwitch = styled(({ isLocked, onChange, ...props }) => (
  <Switch
    focusVisibleClassName=".Mui-focusVisible"
    disableRipple
    checked={isLocked}
    onChange={onChange}
    icon={
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: '#001e3c',
          color: '#fff',
        }}
      >
        <FontAwesomeIcon icon={faLock} />
      </div>
    }
    checkedIcon={
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: '#001e3c',
          color: '#fff',
        }}
      >
        <FontAwesomeIcon icon={faLockOpen} />
      </div>
    }
    {...props}
  />
))(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      transform: 'translateX(32px)',
      '& + .MuiSwitch-track': {
        backgroundColor: '#ffffff',
        opacity: 1,
        ...theme.applyStyles('dark', {
          backgroundColor: '#8796A5',
        }),
      },
    },
  },
  '& .MuiSwitch-thumb': {
    width: 32,
    height: 32,
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20 / 2,
    ...theme.applyStyles('dark', {
      backgroundColor: '#8796A5',
    }),
  },
}));

export default function LockSwitch({ isLocked, onChange, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
      <span style={{ marginTop: '8px', fontSize: '20px', color: '#333' }}>
        {"Visibilité de votre carte mentale"}
      </span>
      <MaterialUISwitch isLocked={isLocked} onChange={onChange} />
      
    </div>
  );
}
