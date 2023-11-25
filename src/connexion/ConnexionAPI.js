import axios from 'axios';

export const Authenticate = async (user, password) => {
    return axios.get('http://localhost:3001/api/user/login', {
        params : {
            'username':user,
            'password':password
        }
    })
    .then(response => {return response.data})
    .catch(error => {console.log(error); throw error;})
}

export const Registry = async (user, password, name, firstName) => {
    return axios.post('http://localhost:3001/api/user/register', {
        params : {
            'username':user,
            'password':password,
            'name':name,
            'firstName':firstName
        }
    })
    .then(response => {console.log(response.data); return response.data})
    .catch(error => {console.log(error); throw error;})
}