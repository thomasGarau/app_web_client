import axios from 'axios';
import history from './history';
import {getTokenAndRole} from '../services/Cookie';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use( async (config) => {
  const {token, role} = await getTokenAndRole();
  if (token) {
    config.headers.Authorization = `bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(async (response) => {
  return response;
}, async (error) => {
  if (error.response && error.response.status === 401) {
    const logoutEvent = new Event('logoutRequired');
    window.dispatchEvent(logoutEvent);
    history.push('/connexion');
    return new Promise((resolve) => {
      resolve({ data: 'Session expired, user logged out.' });
    });
  }
  return Promise.reject(error);
});

export default api;
