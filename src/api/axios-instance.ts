import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000'
});


axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('access_token');

// axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';

export default axiosInstance;