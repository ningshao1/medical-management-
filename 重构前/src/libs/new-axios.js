import router from "../router";
import axios from "axios";
import iView from "iview";
import store from "../store";
import Address from "@common/Address/index";
import { downFile } from '@common/method/util';
const ajaxUrl = Address;
const $axios = axios.create({
    baseURL: ajaxUrl,
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest"
    },
    timeout: 10000
});
// http request 拦截器
$axios.interceptors.request.use(
    config => {

        if (
            localStorage.getItem("token") &&
            JSON.parse(localStorage.getItem("token")).token &&
            router.path !== "/sign"
        ) {
            // 判断是否存在token，如果存在的话，则每个http header都加上token
            Object.assign(config.headers, {
                "login-token": JSON.parse(localStorage.getItem("token")).token
            });
            config.headers["login-token"] = JSON.parse(
                localStorage.getItem("token")
            ).token;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

//上一次报错时的状态码
let lastStatus = null;
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
        //如果连续遇到相同状态码的错误就清除之前的报错提示
        //状态码为null则视为未连接服务器
        if (lastStatus === status) {
            iView.Message.destroy();
        }

        lastStatus = status;

        if (status === null) {
            if (typeof error.message === 'string' && error.message.includes('timeout')) {
                iView.Message.warning("请求超时");
            }
            else if (!cancel) {
                iView.Message.warning("未连接到服务器");
            }
        }
        else {
            const errorMessage =
                error.response.data && error.response.data.message;

            switch (status) {
            case 401:
                // 返回 401 清除token信息并跳转到登录页面
                // localStorage.removeItem('token');
                // localStorage.removeItem('user_in');

                //改用store操作
                store.commit("removeToken");
                store.commit("removeUserIn");
                router.replace({
                    path: "/sign",
                    query: {}
                });
                break;
            case 400:
                if (errorMessage !== "百度分词异常") {
                    iView.Message.warning(errorMessage);
                }
                break;
            case 500:
            case 504:
                iView.Message.warning(
                    "您的请求暂无响应，请检查网络，稍后再试。"
                );
                break;
            }
        }

        return Promise.reject(error);
    }
);
$axios.CancelToken = axios.CancelToken;
export default $axios;