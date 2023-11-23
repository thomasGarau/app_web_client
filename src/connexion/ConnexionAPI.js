import axios from 'axios';

export const Authenticate = async (user, password) => {
    axios.get('http://localhost:3001/api/user/login', {
        params : {
            'username':user,
            'password':password
        }
    })
    .then(response => {console.log(response.data)})
    .catch(error => console.log(error))
}

export const Registry = async (user, password, name, firstName) => {
    axios.post('http://localhost:3001/api/user/register', {
        params : {
            'username':user,
            'password':password,
            'name':name,
            'firstName':firstName
        }
    })
    .then(response => {console.log(response.data)})
    .catch(error => console.log(error))
}