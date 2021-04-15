import axios from 'axios';

//Base URL to make requests to backend
const instanse = axios.create({
    baseURL: 'http://13.53.122.65:8080/',
});

const newUserRequest = axios.post('/user')

export default instanse;
