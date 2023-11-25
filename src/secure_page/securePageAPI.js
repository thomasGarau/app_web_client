import axios from 'axios';

export const testSecure = async (token, authorization) => {
    return axios.get('http://localhost:3001/api/secure-page/test-secure', {
        headers : {
            'token': `Bearer ${token}`,
            'authorization': `Bearer ${authorization}`
        }
    })
    .then(response => {return response.data})
    .catch(error => {console.log(error); throw error;})
}