import axios from 'axios';

const { MS_TODOS_BASE_URL } = process.env;

const todosApi = axios.create({
  baseURL: MS_TODOS_BASE_URL,
});

export default todosApi;
