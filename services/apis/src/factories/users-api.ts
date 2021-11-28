import axios from 'axios';

const { MS_USERS_BASE_URL } = process.env;

const usersApi = axios.create({
  baseURL: MS_USERS_BASE_URL,
});

export default usersApi;
