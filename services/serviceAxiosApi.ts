import axios from 'axios';
import { API_BASE_URL } from '@env';


console.log('API BASE de process.env:', process.env.API_BASE_URL);
console.log('API BASE de @env:', API_BASE_URL);
console.log('API BASE de axios:', axios.defaults.baseURL);

const serviceAxiosApi = axios.create({
  baseURL: `${API_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export {
  serviceAxiosApi,
};
