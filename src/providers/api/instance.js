import axios from 'axios';
import { config } from '../config';

export const instance = axios.create({
  baseURL: config.mainBackendUrl
});

instance.interceptors.request.use(
  request => {
    const token = localStorage.token; // eslint-disable-line
    if (token) request.headers.token = token;
    return request;
  },
  error => Promise.reject(error)
);

instance.interceptors.response.use(
  response => {
    const { data } = response;
    if (data.token) localStorage.token = data.token; // eslint-disable-line
    return data;
  },
  error => {
    const method = error.config.method;
    if (method === 'post' || method === 'put' || method === 'delete') {
      throw error.response.data;
    }
    const { status, data } = error.response;
    let token = status + '::' + data.error;
    if (typeof data.error == 'object') {
      for (const prop in data.error) {
        token = status + '::' + prop;
      }
    } else {
      token = status + '::' + data.error;
    }
    if (data.dataPath) {
      token = token + '::' + data.dataPath;
    }

    throw new Error(token);
  }
);
