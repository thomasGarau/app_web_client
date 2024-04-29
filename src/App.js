import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Remplacez "Switch" par "Routes"
import PrivateRoute from './services/PrivateRoutes';
import PrivateRoute2 from './services/PrivateRoutes2';
import Principal from './principal/Principal';
import Connexion from './connexion/Connexion';
import Register from './connexion/Register';
import Carte_mental from './carte_mental/Carte_mental';
import SecurePage from './secure_page/securePage';
import Profile from './profile/Profile';
import Study from './STUDY/Study';
import Forum from './question/Forum';
import Quizz_principale from './quizz/Quizz_principale';
import CreateQuizz from './quizz/CreateQuizz';
import Question from './quizz/Question';
import Layout from './composent/Layout';

function App() {
  return (
    <Router>
      <Routes> {/* Utilisez la composante "Routes" au lieu de "Switch" */}
        <Route path="/connexion" element={<Layout><Connexion /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
        <Route path="/quizz" element={/*<PrivateRoute> */<Layout><Quizz_principale /> </Layout>/*</PrivateRoute>*/} />
        <Route path="/carte_mental" element={/* <PrivateRoute> */<Layout><Carte_mental /></Layout>/* </PrivateRoute> */} />
        <Route path="/etude" element={/* <PrivateRoute> */<Layout><Study/></Layout>/* </PrivateRoute> */}/>
        <Route path="/forum" element={/* <PrivateRoute> */<Layout><Forum/></Layout>/* </PrivateRoute> */}/>
        <Route path="/create_quizz" element={/* <PrivateRoute> */<Layout><CreateQuizz/></Layout>/* </PrivateRoute> */}/>
        <Route path="/question" element={/* <PrivateRoute> */<Layout><Question /></Layout>/* </PrivateRoute> */}/>
        <Route path="/secure_page" element={/* <PrivateRoute> */<Layout><SecurePage /></Layout>/* <PrivateRoute> */} />
        <Route path='/secure_page2' element={<PrivateRoute2><Layout><SecurePage /></Layout></PrivateRoute2>} />
        <Route path="/profile" element={/*<PrivateRoute>*/<Layout><Profile /></Layout>/*</PrivateRoute> />*/}/>
        <Route path="/" element={<Layout><Principal /></Layout>} /> 
      </Routes>
    </Router>
  );
}

export default App;
