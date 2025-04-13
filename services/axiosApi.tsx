import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { BaseLibraryUrl, BaseUserApiUrl } from "@/constants/Url";
import { login } from '@/services/userService';

// Create an Axios instance
const api = axios.create({
  baseURL: BaseLibraryUrl,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

const apiUser = axios.create({
  baseURL: BaseUserApiUrl,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add token to headers
apiUser.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error: any) => Promise.reject(error));

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error: any) => Promise.reject(error));

// Response interceptor: Handle token expiration (401)
apiUser.interceptors.response.use(
  (response: any) => response,
  async (error: { response: { status: number; }; config: { headers: { Authorization: string; }; }; }) => {
    if (error.response?.status === 401) {
      console.log('Token expired, attempting re-login...');
      const newToken = await reAuthenticate();
      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return axios(error.config); // Retry the request
      }
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: any) => response,
  async (error: { response: { status: number; }; config: { headers: { Authorization: string; }; }; }) => {
    if (error.response?.status === 401) {
      console.log('Token expired, attempting re-login...');
      const newToken = await reAuthenticate();
      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return axios(error.config); // Retry the request
      }
    }
    return Promise.reject(error);
  }
);

// Function to re-authenticate
const reAuthenticate = async () => {
  await SecureStore.setItemAsync('token', '');
  const email = await SecureStore.getItemAsync('username');
  const password = await SecureStore.getItemAsync('password');
  
  if (!email || !password) return null;
  try {
    const response = await login(email, password);
    console.log(response);
    if (response?.token) {
      await SecureStore.setItemAsync('token', response.token);
      return response.token;
    }
  } catch (error) {
    console.error('Re-authentication failed', error);
  }
  return null;
};

export default api;
