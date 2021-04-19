import axios from 'axios';

//Base URL to make requests to backend
const instanse = axios.create({
    baseURL: 'http://13.51.58.86:8080',
});

export default instanse;
