import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:5000', 
});

// Adding token to headers in every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Get token from storage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;




// import axios from 'axios';

// const axiosInstance = axios.create({
//     baseURL: "http://127.0.0.1:7000",
// });

// axiosInstance.interceptors.request.use((config) => {
//     const token = localStorage.getItem("authToken");
//     if(token) {
//         config.headers.Authorization =  `Bearer ${token}`;

//     }
//     return config;
// });

// export default axiosInstance;