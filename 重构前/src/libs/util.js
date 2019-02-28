import axios from 'axios';
import router from '../router';
// import Vue from 'vue';
// import iView from 'iview';
import Address from '@common/Address/index';
let util = {

};
util.title = function (title) {
    title = title ? title + ' - Home' : '医学装备信息化管理系统-登录 恺立达';
    window.document.title = title;
};

const ajaxUrl = Address;
util.ajax = axios.create({
    baseURL: ajaxUrl,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
    },
    timeout: 8000
});
// download url
const downloadUrl = url => {
    let iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = url + `?login-token=${JSON.parse(localStorage.getItem('token')).token}`;
    iframe.onload = function () {
        document.body.removeChild(iframe)
    }
    document.body.appendChild(iframe)
}
// http request 拦截器
util.ajax.interceptors.request.use(
    config => {
        if (localStorage.getItem('token') && JSON.parse(localStorage.getItem('token')).token && router.path !== '/sign') { // 判断是否存在token，如果存在的话，则每个http header都加上token
            Object.assign(config.headers, { 'login-token': JSON.parse(localStorage.getItem('token')).token });
            config.headers['login-token'] = JSON.parse(localStorage.getItem('token')).token;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });
util.ajax.interceptors.response.use(
    response => {
        if (response.headers && (response.headers['content-type'] === 'application/x-msdownload' || response.headers['content-type'] === "application/x-download;charset=UTF-8" || response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
            downloadUrl(response.request.responseURL)

        }
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
            case 401:
                // 返回 401 清除token信息并跳转到登录页面
                localStorage.removeItem('token');
                localStorage.removeItem('user_in');
                router.replace({
                    path: '/sign',
                    query: {}
                })
                break;
            case 403:
                //alert(1)
                clearTimeout(timer)
                var timer = setTimeout(() => {

                    // iView.Message.warning("对不起，您没有权限获取该内容");
                })
                break;
            case 400:
                // this.$Message.warning("对不起，您的参数有误");
            case 500:
                // this.$Message.warning("对不起，服务器错误");
            case 504:
                // this.$Message.warning("对不起，服务器未响应");
            }
            if (localStorage.getItem('user_in')) {

            }
        }
        return Promise.reject(error.response.data) // 返回接口返回的错误信息
    });
//util.$ = $;
export default util;