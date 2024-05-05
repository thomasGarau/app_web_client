import React from 'react';
import './Presentation.css';
import { Card, Box, CardContent, Typography, IconButton, CardMedia } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const Presentation = () => {
    return (
        <div className='background-presentation'>
            <h1 className='presentation-title'>Bienvenu sur Trackmates!</h1>
            <div className=''>
                <Card className='presentation-card'></Card>
                    <CardContent>
                        <Typography variant='h5' className='presentation-card-title'>Apprendre en s'amusant</Typography>
                        <Typography variant='body1' className='presentation-card-text'>Trackmates est une application qui vous permet d'apprendre de manière ludique et interactive. Vous pouvez créer des quizz, des cartes mentales, des forums et bien plus encore!</Typography>
                    </CardContent>
                    <CardMedia
                        component='img'
                        image='https://images.unsplash.com/photo-1562887282-6e2f9d5f4d6f'
                        alt='image'
                        className='presentation-card-image'
                    />
                <div className=''>


                </div>
            </div>
        </div>
    );
};

export default Presentation;