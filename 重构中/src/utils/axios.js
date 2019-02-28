import axios from 'axios';
import router from "../router";
import store from "../store";
import Address from "./Address/index";
import vue from 'vue';
import downFile from './down';
import { Message } from "@/element-ui";
const ajaxUrl = Address;
const $axios = axios.create({
    baseURL: ajaxUrl,
    timeout: 10000
});
// http request 拦截器
$axios.interceptors.request.use(
    config => {
        const Token = store.state.token;
        Object.assign(config.headers, {
            "login-token": Token ? Token.token : undefined
        });
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);
$axios.interceptors.response.use(
    response => {
        const conf = response.config;
        if (conf.method.toLowerCase() === "post" &&
            (conf.kldMeta === undefined || conf.kldMeta.filename === undefined)) {
            return response;
        }
        downFile(response, conf.method.toLowerCase() === "post" ? conf.kldMeta.filename : undefined)
        return response;
    },
    error => {
        const status = error.response ? error.response.status : null;
        const cancel = error.__CANCEL__;

        if (status === null) {
            if (typeof error.message === 'string' && error.message.includes('timeout')) {
                // iView.Message.warning("请求超时");
            }
            else if (!cancel) {
                // iView.Message.warning("未连接到服务器");
            }
        }
        else {
            const errorMessage =
                error.response.data && error.response.data.message;
            console.log(status)

            switch (status) {
            case 400:
                if (errorMessage !== "百度分词异常") {
                    Message.warning(errorMessage)
                }
                break;
            case 401:
                store.commit("logout");
                break;
            case 500:
            case 504:
                // iView.Message.warning(
                //     "您的请求暂无响应，请检查网络，稍后再试。"
                // );
                Message.warning("您的请求暂无响应，请检查网络，稍后再试。")
                break;
            }
        }

        return Promise.reject(error);
    }
);
$axios.__proto__ = axios;
vue.prototype.$axios = $axios;
export default $axios;