import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "@fontsource/nanum-pen-script";
import Header from '../composent/Header.js';
import stars_yellow from './img/star_full.png';
import { getTokenAndRole } from '../services/Cookie.js';
import { getQuizzParChap } from './QuizzAPI.js';
import './Quizz.css';

function Quizz_principale() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('prof');
  const [quizzes, setQuizzes] = useState(null);
  const { id } = useParams();
  console.log("id : ", id);

  const getTabStyle = (tabName) => ({
    textDecoration: activeTab === tabName ? 'underline' : 'none',
    color: activeTab === tabName ? 'black' : 'grey',
    cursor: 'pointer'
  });

  useEffect(() => {
    const fetchUeData = async () => {
      try {
        const {token, role} = getTokenAndRole();
        const quizzs = await getQuizzParChap(id);
        setQuizzes(quizzs);
        console.log(quizzes);
      } catch (error) {
          console.error('Erreur lors de la récupération des UE:', error);
      }
    };

    fetchUeData();
  }, []);

  return (
    <div className='background_quizz_principale'>
      <Header />
      <div className='base-container_quizz_principale'>
        <h1 className='quizz-title'>Quizz de l'UE</h1>
        <div className='quizz_type'>
          <h2 className='Nom_Quizz' style={getTabStyle('prof')} onClick={() => setActiveTab('prof')}>Quizz Prof</h2>
          <h2 className='Nom_Quizz' style={getTabStyle('eleve')} onClick={() => setActiveTab('eleve')}>Quizz Eudiant</h2>
        </div>
        <div className='container_quizzs'>
          {quizzes ? (
            quizzes.length > 0 ? (
              quizzes.filter(quiz => quiz.id === activeTab).map(quiz => (
                <div key={quiz.id} className='container_quizz'>
                  <div id='quizz_num' className='item_quizz'>
                    <p>{quiz.number}</p>
                  </div>
                  <div id='quizz_sujet' className='theme_quizz'>
                    <p>{quiz.topic}</p>
                  </div>
                  <div id='quizz_like' className='quizz_like'>
                    <p>{quiz.likes} </p>
                    <img className='img_coeur' src={stars_yellow} alt='like' />
                  </div>
                  <button onClick={() => navigate('/')} className='btn_quizz button-connection'>Commencer</button>
                </div>
              ))
            ) : <p>Aucun quizz disponible.</p>
          ) : <p>Aucun quizz disponible</p>}
        </div>
        <button onClick={() => navigate('/create_quizz')} className='btn_quizz_creer button-connection'>Creer un quizz</button>
      </div>
    </div>
  );
}

export default Quizz_principale;
