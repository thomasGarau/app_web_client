import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "@fontsource/nanum-pen-script";
import stars_yellow from './img/star_full.png';
import { getTokenAndRole } from '../services/Cookie.js';
import { getQuizzParChap, getQuestionParQUizz, getChapitreById } from './QuizzAPI.js';
import { Box, FormControl, InputLabel, MenuItem, Modal, Popover, Select, Typography } from '@mui/material';
import './Quizz.css';
import StyledButton from '../composent/StyledBouton.js';

function Quizz_principale() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('prof');
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const { id } = useParams();
  const [ueId, setUeId] = useState('');

  const getTabStyle = (tabName) => ({
    textDecoration: activeTab === tabName ? 'underline' : 'none',
    color: activeTab === tabName ? 'black' : 'grey',
    cursor: 'pointer'
  });

  const fetchUeData = async () => {
    try {
      const quizzsResponse = await getQuizzParChap(id);
      let quizzProfesseurs = [];
      let quizzEleves = [];
      
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


      const responseInfo = await getChapitreById(id);
      setUeId(responseInfo[0].id_ue);
      
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
        <Typography sx={{fontSize: { xs: "2em", sm: "3em", md: "4em" }}} className='quizz-title'>Quizz de l'UE</Typography>
        <div className='quizz_type'>
          <Typography sx={{fontSize: { xs: "1em", sm: "1.5em", md: "2em" }}} style={getTabStyle('prof')} onClick={() => setActiveTab('prof')} className='quizz-title'>Quizz Prof</Typography>
          <Typography sx={{fontSize: { xs: "1em", sm: "1.5em", md: "2em" }}} style={getTabStyle('eleve')} onClick={() => setActiveTab('eleve')} className='quizz-title'>Quizz Etudiant</Typography>
        </div>
        <div className='container_quizzs'>
          {quizzes ? (
            quizzes.length > 0 ? (
              quizzes.filter(quiz => quiz.createur === activeTab).map(quiz => (

              <Box sx={{ flexWrap: { lg: 'nowrap', xs: 'wrap' }, height: { lg: '120px', xs: '220px' } }}
                key={quiz.id_quizz} className='container_quizz'>
                <Box sx={{ height: { md: '75px', sm: '62px', xs: '50px' } }} id='quizz_sujet' className='theme_quizz'>
                  <Typography sx={{
                    fontSize: { xs: "0.7em", sm: "1em", md: "1.7em" },
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis"
                }}>{quiz.label}</Typography>
            </Box>
            <Box sx={{ height: { md: '75px', sm: '62px', xs: '50px' } }} id='quizz_like' className='quizz_like'>
                <Typography sx={{
                    fontSize: { xs: "0.7em", sm: "1em", md: "1.7em" },
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis"
                }}>{quiz.note} </Typography>
                <img className='img_coeur' src={stars_yellow} alt='like' />
            </Box>
                  <StyledButton
                  width={200}
                  color={'white'}
                  onClick={() => navigate(`/quiz/${quiz.id_quizz}/question-handler`)}  
                  content={"Commencer"}>Commencer</StyledButton>

                </Box>
              ))
            ) : <p>Aucun quizz disponible.</p>
          ) : <p>Aucun quizz disponible</p>}
        </div>
        <StyledButton 
        onClick={() => navigate(`/create_quizz/${ueId}`)} 
        color={'primary'}
        content={"Creer un quizz"} ></StyledButton>
      </div>
    </div>
  );
}

export default Quizz_principale;
