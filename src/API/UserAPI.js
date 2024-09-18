import api from '../config/axiosConfig.js'
import axios from 'axios';

export const Authenticate = async (user, password) => {
    return axios.post('http://localhost:3001/api/user/login', {
        num_etudiant:user,
        password
    })
    .then(response => {return response.data})
    .catch(error => { throw error;})
}

export const Registry = async (email, password, consentement) => {
    return axios.post('http://localhost:3001/api/user/register', {
            'email':email,
            'password':password,
            'consentement':consentement
    })
    .then(response => {return response.data})
    .catch(error => {throw error;})
}

export const verifyToken = async (token) => {
    return api.get('/user/verify-token',  {})
    .then(response => {return response.data})
    .catch(error => { throw error;})
}

export const logout = async (token) => {
    return api.post('/user/logout', {})
    .then(response => {return response.data})
    .catch(error => {throw error;})
}



export const Retrieve = async (num_etudiant) => {
    const body = {
        num_etudiant: num_etudiant
    }
    try {
        const response = await axios.post('http://localhost:3001/api/user/forgetPassword', body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const updatePassword = async (num_etudiant, verif_code, password) => {
    const body = {
        num_etudiant: num_etudiant,
        verif_code: verif_code,
        password: password
    }
    try {
        const response = await axios.post(`http://localhost:3001/api/user/updatePassword`, body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}