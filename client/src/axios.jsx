import axios from 'axios';

//Base URL to make requests to backend
const instanse = axios.create({
    baseURL: 'https://localhost:8080',
});

export default instanse;
