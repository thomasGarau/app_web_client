import api from '../config/axiosConfig.js'
import axios from 'axios';

export const Authenticate = async (user, password) => {
    console.log("authenticate")
    return axios.post('http://localhost:3001/api/user/login', {
        num_etudiant:user,
        password
    })
    .then(response => {console.log(response.data);return response.data})
    .catch(error => {console.log(error); throw error;})
}

export const Registry = async (email, password) => {
    console.log("registry")
    return axios.post('http://localhost:3001/api/user/register', {
            'email':email,
            'password':password
    })
    .then(response => {return response.data})
    .catch(error => {console.log(error); throw error;})
}

export const verifyToken = async (token) => {
    console.log("verifyToken")
    return api.get('/user/verify-token',  {})
    .then(response => {return response.data})
    .catch(error => {console.log(error); throw error;})
}

export const logout = async (token) => {
    return api.post('/user/logout', {})
    .then(response => {return response.data})
    .catch(error => {console.log(error); throw error;})
}


export const getUserInfo = async () => {
    try {
        const response = await api.get(`/user/getUserInfo`);
        console.log("réponse info : ",response);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}