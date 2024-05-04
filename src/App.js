import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import './App.css';
import PrivateRoute from './services/PrivateRoutes';
import PublicRoute from './services/PublicRoute';
import Principal from './principal/Principal';
import Connexion from './connexion/Connexion';
import Register from './connexion/Register';
import Carte_mental from './carte_mental/Carte_mental';
import Home from './home/home';
import Profile from './profile/Profile';
import Study from './STUDY/Study';
import Forum from './forum/Forum';
import Quizz_principale from './quizz/Quizz_principale';
import CreateQuizz from './quizz/CreateQuizz';
import Question from './quizz/Question';
import Forgot from './connexion/Forgot';
import Reset from './connexion/Reset';
import Layout from './composent/Layout';
import Ue from './ue/Ue';
import QuestionHandler from './quizz/QuestionHandler';
import QuizzFin from './quizz/QuizzFin';
import { QuizProvider } from './quizz/QuizContext';
import StatQuizz from './quizz/StatQuizz';
import StatQuestion from './quizz/statQuestion';
import UpdateQuizz from './quizz/UpdateQuizz';
import CreateForum from './forum/CreateForum';
;

function App() {
  return (
    <QuizProvider>
    <Router>
      <Routes> 
        <Route path="/connexion" element={<PublicRoute><Layout><Connexion /></Layout></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Layout><Register /></Layout></PublicRoute>} />
        <Route path="/forgot_password" element={<PublicRoute><Layout><Forgot /></Layout></PublicRoute>} />
        <Route path="/reset_password" element={<PublicRoute><Layout><Reset /></Layout></PublicRoute>} />
        <Route path="/ue/:id" element={<PrivateRoute><Layout><Ue /></Layout></PrivateRoute>} />
        <Route path="/quizz/:id" element={<PrivateRoute> <Layout><Quizz_principale /> </Layout></PrivateRoute>} />
        <Route path="/statQuizz/:quizId/:noteQuizId" element={<PrivateRoute> <Layout><StatQuizz /> </Layout></PrivateRoute>} />
        <Route path="/statQuizz/:quizId/:noteQuizId/:questionId" element={<PrivateRoute> <Layout><StatQuestion /> </Layout></PrivateRoute>} />
        <Route path="/carte_mental" element={ <PrivateRoute> <Layout><Carte_mental /></Layout> </PrivateRoute> } />
        <Route path="/etude/:id" element={ <PrivateRoute> <Layout><Study/></Layout> </PrivateRoute> }/>
        <Route path="/forum/:id_forum" element={ <PrivateRoute> <Layout><Forum/></Layout> </PrivateRoute> }/>
        <Route path="/create-forum/:id_chap" element={ <PrivateRoute> <Layout><CreateForum/></Layout> </PrivateRoute> }/>
        <Route path="/quiz-completed/:quizId" element={<PrivateRoute><Layout><QuizzFin /></Layout></PrivateRoute>} />
        <Route path="/create_quizz" element={ <PrivateRoute> <Layout><CreateQuizz/></Layout> </PrivateRoute> }/>
        <Route path="/update_quizz/:quizId" element={ <PrivateRoute> <Layout><UpdateQuizz/></Layout> </PrivateRoute> }/>
        <Route path="/quiz/:quizId/question/:questionId" element={ <PrivateRoute> <Layout><Question /></Layout> </PrivateRoute> }/>
        <Route path="/quiz/:quizId/question-handler" element={<PrivateRoute> <Layout><QuestionHandler /> </Layout> </PrivateRoute> } />
        <Route path="/home" element={<PrivateRoute> <Layout><Home /></Layout> </PrivateRoute> } />
        <Route path="/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />
        <Route path="/" element={<PublicRoute><Layout><Principal /></Layout></PublicRoute>} /> 
      </Routes>
    </Router>
    </QuizProvider>
  );
}

export default App;
