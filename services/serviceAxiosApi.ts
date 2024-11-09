import axios from 'axios';
import { API_BASE_URL } from '@env';


const API_URL = 'http://192.168.1.108:3000/';

const serviceAxiosApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export {
  serviceAxiosApi,
};
