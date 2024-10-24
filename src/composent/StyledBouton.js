import { Button } from '@mui/material';
import React from 'react';

export default function StyledButton({ content, width, onClick, color, ariaDescribedby, isAbsolute, isDisabled }) {
    const styledButton = {
        position: isAbsolute ? 'absolute' : 'relative',
        fontFamily: 'Shadows Into Light',
        fontSize: { xs: '0.7em', sm: '1em', md: '1.7em' },
        border: 'none',
        color: color === "primary" ? 'white' : 'black',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        borderRadius: '50px',
        width: { xs: `${width ? width - 200 : 200}px`, sm: `${width ? width - 100 : 300}px`, md: `${width ? width : 400}px` },
        boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)',
        transitionDuration: '0.4s',
        backgroundColor: color === "primary" ? '#133D56' : color === "secondary" ? "#c3d9ff" : color === undefined ? 'rgb(245, 245, 245)' : color,
        margin: { xs: '10px 5px', md: '20px 10px' },
        height: { xs: '50px', sm: '62px', md: '75px' },
        textTransform: 'none',
        padding: { xs: '0px 5px', md: '0px 10px' },
        '&:hover': {
            boxShadow: '0 12px 16px 0 rgba(0,0,0,0.4), 0 17px 50px 0 rgba(0,0,0,0.3)',
            backgroundColor: color === "primary" ? '#133D56' : color === "secondary" ? "#c3d9ff" : color === undefined ? 'rgb(245, 245, 245)' : color,
        },
    };

    return (
        <Button
            disabled={isDisabled ? isDisabled : false}
            aria-describedby={ariaDescribedby ? ariaDescribedby : null}
            sx={styledButton}
            onClick={onClick}
        >
            {content}
        </Button>
    );
}
