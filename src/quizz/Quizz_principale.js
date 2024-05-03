import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "@fontsource/nanum-pen-script";
import Header from '../composent/Header.js';
import stars_yellow from './img/star_full.png';
import { getTokenAndRole } from '../services/Cookie.js';
import { getQuizzParChap, getQuestionParQUizz } from './QuizzAPI.js';
import './Quizz.css';

function Quizz_principale() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('prof');
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const { id } = useParams();
  console.log("id : ", id);

  const getTabStyle = (tabName) => ({
    textDecoration: activeTab === tabName ? 'underline' : 'none',
    color: activeTab === tabName ? 'black' : 'grey',
    cursor: 'pointer'
  });

  const fetchUeData = async () => {
    try {
      const quizzsResponse = await getQuizzParChap(id);
      let quizzProfesseurs = [];
      let quizzEleves = []
      console.log("quizzsResponse : ", quizzsResponse);
      
      if (quizzsResponse && Array.isArray(quizzsResponse[0])) {
        // Ajouter une propriété pour indiquer le type de chaque quizz
        quizzProfesseurs = quizzsResponse[0].map((quiz, index) => ({ ...quiz, createur: 'prof', number: index + 1 }));
      }
      if (quizzsResponse && Array.isArray(quizzsResponse[1])) {
        // Ajouter une propriété pour indiquer le type de chaque quizz et un quizz_num qui correspond à son ordre dans la liste
        quizzEleves = quizzsResponse[1].map((quiz, index) => ({
          ...quiz, 
          createur: 'eleve',
          number: index + 1 // Commence à 1 pour le premier élément
        }));
      }

      // Fusionner les deux listes de quizz dans un seul tableau
      const combinedQuizzes = [...quizzProfesseurs, ...quizzEleves];
      setQuizzes(combinedQuizzes);
      
    } catch (error) {
      console.error('Erreur lors de la récupération des quizz:', error);
    }
};





  useEffect(() => {
    fetchUeData();
  }, []); 

  

  

  return (
    <div className='background_quizz_principale'>
      <div className='base-container_quizz_principale'>
        <h1 className='quizz-title'>Quizz de l'UE</h1>
        <div className='quizz_type'>
          <h2 className='Nom_Quizz' style={getTabStyle('prof')} onClick={() => setActiveTab('prof')}>Quizz Prof</h2>
          <h2 className='Nom_Quizz' style={getTabStyle('eleve')} onClick={() => setActiveTab('eleve')}>Quizz Eudiant</h2>
        </div>
        <div className='container_quizzs'>
          {quizzes ? (
            quizzes.length > 0 ? (
              quizzes.filter(quiz => quiz.createur === activeTab).map(quiz => (
                <div key={quiz.id_quizz} className='container_quizz'>
                  <div id='quizz_sujet' className='theme_quizz'>
                    <p>{quiz.label}</p>
                  </div>
                  <div id='quizz_like' className='quizz_like'>
                    <p>{quiz.note} </p>
                    <img className='img_coeur' src={stars_yellow} alt='like' />
                  </div>
                  <button onClick={() => navigate(`/quiz/${quiz.id_quizz}/question-handler`)} className='btn_quizz button-connection'>Commencer</button>

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
