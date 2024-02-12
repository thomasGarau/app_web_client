//dependances
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "@fontsource/nanum-pen-script";
import Header from '../composent/Header.js';
import stars from './img/star_empty.png';
import stars_yellow from './img/star_full.png';
import './Quizz.css';

function Quizz_principale () {
  const navigate = useNavigate();

  return (
    <div className='background_quizz_principale'>
      <Header></Header>
        <div className='base-container_quizz_principale'>
          <h1 className='quizz-title'>Quizz de l'UE</h1>
          <div className='container_quizzs'>
            <div className='container_quizz'>
              <div id='quizz_num' className='item_quizz'>
                <p>Quizz 1</p>
              </div>
              <div id='quizz_sujet' className='theme_quizz'>
                <p>Les bases de donnees</p>
              </div>
              <div id='quizz_like' className='quizz_like'>
                <p>2 </p>
                <img className='img_coeur' src={stars_yellow} alt='like'/>
              </div>
              <button onClick={() => navigate('/')} className='btn_quizz'>Commencer</button>
            </div>
            
            </div>
        </div>
    </div>
  );
  
} export default Quizz_principale;