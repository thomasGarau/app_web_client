import { styled } from '@mui/system';
import { Button } from '@mui/material';
import React, { useState } from 'react';

export default function StyledButton({content, width}) {
    const [styledButtonHigh] = useState({
        fontFamily: 'Nanum Pen Script',
        fontSize: '2em',
        border: 'none',
        color: 'white',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        borderRadius: '50px',
        width: width || '300px',
        boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)',
        transitionDuration: '0.4s',
        backgroundColor: '#133D56',
        margin: '20px 0px',
        height: '50px',
        textTransform: 'none',
        padding: '0px',
        maxWidth: '400px',
        '&:hover': {
            boxShadow: '0 12px 16px 0 rgba(0,0,0,0.4), 0 17px 50px 0 rgba(0,0,0,0.3)',
            backgroundColor: '#133D56',
        },
    });

    const [styledButtonLow] = useState({
        fontFamily: 'Nanum Pen Script',
        fontSize: '1.2em',
        border: 'none',
        color: 'white',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        borderRadius: '50px',
        width: width || '300px',
        boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)',
        transitionDuration: '0.4s',
        backgroundColor: '#133D56',
        margin: '20px 0px',
        height: '50px',
        textTransform: 'none',
        padding: '0px',
        maxWidth: '200px',
        '&:hover': {
            boxShadow: '0 12px 16px 0 rgba(0,0,0,0.4), 0 17px 50px 0 rgba(0,0,0,0.3)',
            backgroundColor: '#133D56',
        },
    });
    return (
        <><Button sx={window.visualViewport.width <= 600? styledButtonLow : styledButtonHigh}>{content}</Button></>
        
    )
}



