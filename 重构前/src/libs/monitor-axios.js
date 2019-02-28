import axios from "axios";
import qs from 'qs';
const baseURL = 'http://user.hddvs.net:8080/apiv2/';

const _axios = axios.create({
    baseURL: baseURL,
    timeout: 5000
});
// http request 拦截器
_axios.interceptors.request.use(
    config => {
        config.data = qs.stringify(config.data)
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);
_axios.CancelToken = axios.CancelToken;
export default _axios;