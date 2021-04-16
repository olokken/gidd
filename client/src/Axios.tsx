import axios from 'axios';

//Base URL to make requests to backend
const instanse = axios.create({
    baseURL: 'http://13.53.115.146:8080',
});

export default instanse;
