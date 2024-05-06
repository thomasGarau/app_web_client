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
import GestionQuizz from './quizz/GestionQuizz';
import Presentation from './presentation/Presentation';
import UeProf from './ue/UeProf'
import GestionQuizzProf from './quizz/GestionQuizzProf'
import RoleBasedRoute from './services/RoleBasedRoute';
;

function App() {
  return (
    <QuizProvider>
    <Router>
      <Routes> 
        <Route path="/connexion" element={<PublicRoute><Layout><Connexion /></Layout></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Layout><Register /></Layout></PublicRoute>} />
        <Route path="/presentation" element={<PublicRoute><Layout><Presentation /></Layout></PublicRoute>} />
        <Route path="/forgot_password" element={<PublicRoute><Layout><Forgot /></Layout></PublicRoute>} />
        <Route path="/reset_password" element={<PublicRoute><Layout><Reset /></Layout></PublicRoute>} />


        <Route path="/ue/:id" element={<RoleBasedRoute allowedRoles={['etudiant']}><Layout><Ue /></Layout></RoleBasedRoute>} />
        <Route path="/quizz/:id" element={<RoleBasedRoute allowedRoles={['etudiant']}> <Layout><Quizz_principale /> </Layout></RoleBasedRoute>} />
        <Route path="/gestion_quizz" element={<RoleBasedRoute allowedRoles={['etudiant']}> <Layout><GestionQuizz /> </Layout></RoleBasedRoute>} />
        <Route path="/statQuizz/:quizId/:noteQuizId" element={<RoleBasedRoute allowedRoles={['etudiant']}> <Layout><StatQuizz /> </Layout></RoleBasedRoute>} />
        <Route path="/statQuizz/:quizId/:noteQuizId/:questionId" element={<RoleBasedRoute allowedRoles={['etudiant']}> <Layout><StatQuestion /> </Layout></RoleBasedRoute>} />
        <Route path="/carte_mental" element={ <RoleBasedRoute allowedRoles={['etudiant']}> <Layout><Carte_mental /></Layout> </RoleBasedRoute> } />
        <Route path="/forum/:id_forum" element={ <RoleBasedRoute allowedRoles={['etudiant']}> <Layout><Forum/></Layout> </RoleBasedRoute> }/>
        <Route path="/forum/chap/:id_chap" element={ <RoleBasedRoute allowedRoles={['etudiant']}> <Layout><CreateForum/></Layout> </RoleBasedRoute> }/>
        <Route path="/forum/quizz/:id_quizz" element={ <RoleBasedRoute allowedRoles={['etudiant']}> <Layout><CreateForum/></Layout> </RoleBasedRoute> }/>
        <Route path="/quiz-completed/:quizId" element={<RoleBasedRoute allowedRoles={['etudiant']}><Layout><QuizzFin /></Layout></RoleBasedRoute>} />
        <Route path="/quiz/:quizId/question/:questionId" element={ <RoleBasedRoute allowedRoles={['etudiant']}> <Layout><Question /></Layout> </RoleBasedRoute> }/>
        <Route path="/quiz/:quizId/question-handler" element={<RoleBasedRoute allowedRoles={['etudiant']}> <Layout><QuestionHandler /> </Layout> </RoleBasedRoute> } />
        
        <Route path="/gestion_quizz/prof/:id" element={<RoleBasedRoute allowedRoles={['enseignant']}> <Layout><GestionQuizzProf /> </Layout></RoleBasedRoute>} />
        <Route path="/gestion_quizz/prof/" element={<RoleBasedRoute allowedRoles={['enseignant']}> <Layout><GestionQuizzProf /> </Layout></RoleBasedRoute>} />
        <Route path="/ueProf/:id" element={ <RoleBasedRoute allowedRoles={['enseignant']}> <Layout><UeProf/></Layout> </RoleBasedRoute> }/>

        <Route path="/etude/:id" element={ <RoleBasedRoute allowedRoles={['enseignant', 'etudiant']}> <Layout><Study/></Layout> </RoleBasedRoute> }/>
        <Route path="/create_quizz/:idUe" element={ <RoleBasedRoute  allowedRoles={['enseignant', 'etudiant']}> <Layout><CreateQuizz/></Layout> </RoleBasedRoute> }/>
        <Route path="/update_quizz/:quizId" element={ <RoleBasedRoute allowedRoles={['enseignant', 'etudiant']}> <Layout><UpdateQuizz/></Layout> </RoleBasedRoute> }/>
        <Route path="/home" element={<RoleBasedRoute allowedRoles={['enseignant', 'etudiant']}> <Layout><Home /></Layout> </RoleBasedRoute> } />
        <Route path="/profile" element={<RoleBasedRoute allowedRoles={['enseignant', 'etudiant']}><Layout><Profile /></Layout></RoleBasedRoute>} />
        <Route path="/" element={<PublicRoute><Layout><Principal /></Layout></PublicRoute>} /> 
      </Routes>
    </Router>
    </QuizProvider>
  );
}

export default App;
