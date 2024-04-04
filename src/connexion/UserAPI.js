import axios from 'axios';

export const Authenticate = async (user, password) => {
    console.log("authenticate")
    return axios.post('http://localhost:3001/api/user/login', {
        username:user,
        password
    })
    .then(response => {console.log(response.data);return response.data})
    .catch(error => {console.log(error); throw error;})
}

export const Registry = async (user, password) => {
    console.log("registry")
    return axios.post('http://localhost:3001/api/user/register', {
            'username':user,
            'password':password
    })
    .then(response => {return response.data})
    .catch(error => {console.log(error); throw error;})
}

export const verifyToken = async (token) => {
    console.log("verifyToken")
    return axios.get('http://localhost:3001/api/user/verify-token',  {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {return response.data})
    .catch(error => {console.log(error); throw error;})
}

export const logout = async (token) => {
    return axios.post('http://localhost:3001/api/user/logout', {}, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {return response.data})
    .catch(error => {console.log(error); throw error;})
}