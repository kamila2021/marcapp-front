import axios from 'axios';
import { API_BASE_URL } from '@env';


console.log('API BASE URL:', API_BASE_URL);

const serviceAxiosApi = axios.create({
  baseURL: `${API_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export {
  serviceAxiosApi,
};
