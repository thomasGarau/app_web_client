// Dépendances
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "@fontsource/nanum-pen-script";
import Header from '../composent/Header.js';
import stars_yellow from './img/star_full.png';
import './Quizz.css';

function Quizz_principale () {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('prof');

  const getTabStyle = (tabName) => ({
    textDecoration: activeTab === tabName ? 'underline' : 'none',
    color: activeTab === tabName ? 'black' : 'grey',
    cursor: 'pointer'
  });

  return (
    <div className='background_quizz_principale'>
      <div className='base-container_quizz_principale'>
        <h1 className='quizz-title'>Quizz de l'UE</h1>
        <div className='quizz_type'>
          <h2 className='Nom_Quizz' style={getTabStyle('prof')} onClick={() => setActiveTab('prof')}> Quizz Prof</h2>
          <h2 className='Nom_Quizz' style={getTabStyle('eleve')} onClick={() => setActiveTab('eleve')}> Quizz Etudiant</h2>
        </div>

        <div className='container_quizzs'>
          {activeTab === 'prof' && (
            // Contenu de l'onglet 'Quizz Prof'
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
              <button onClick={() => navigate('/')} className='btn_quizz button-connection'>Commencer</button>
            </div>
          )}
          {activeTab === 'eleve' && (
            <div className='container_quizz'>
            <div id='quizz_num' className='item_quizz'>
              <p>Quizz 2</p>
            </div>
            <div id='quizz_sujet' className='theme_quizz'>
              <p>Les maths miam</p>
            </div>
            <div id='quizz_like' className='quizz_like'>
              <p>4 </p>
              <img className='img_coeur' src={stars_yellow} alt='like'/>
            </div>
            <button onClick={() => navigate('/')} className='btn_quizz button-connection'>Commencer</button>
          </div>
          )}
          <button onClick={() => navigate('/create_quizz')} className='btn_quizz_creer button-connection'>Creer un quizz</button>
        </div>
      </div>
    </div>
  );
  
} export default Quizz_principale;
