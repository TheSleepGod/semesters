import axios from 'axios'
import router from '@/router'
import user from "@/store/user";
// axios.defaults.baseURL = 'http://43.138.22.20:8000/api'
// axios.defaults.baseURL = 'http://43.138.29.81:8080/api'
// 如果请求话费了超过 `timeout` 的时间，请求将被中断
axios.defaults.withCredentials=true;
axios.defaults.timeout = 10800000;
// 表示跨域请求时是否需要使用凭证
axios.defaults.withCredentials = false;
// axios.defaults.headers.common['token'] =  AUTH_TOKEN
 axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8;';
// 允许跨域
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';


axios.interceptors.request.use(
    config => {
        const userInfo = user.getters.getUser(user.state());
        if (userInfo) {
            config.headers.Authorization = userInfo.user.Authorization;
        }
        return config;
    },
    error => {
        console.log("error");
        return Promise.reject(error);
    }
);
export default axios