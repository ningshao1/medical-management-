const $axios = (function(axios, $, iView, plugins) {
    const ajaxUrl = Address;
    const { kldConfirm } = plugins;
    let haveToken = true;
    const $axios = axios.create({
        baseURL: ajaxUrl,
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest"
        }
    });

    // download url
    const downloadUrl = url => {
        let iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src =
            url +
            `?login-token=${JSON.parse(localStorage.getItem("token")).token}`;
        iframe.onload = function() {
            document.body.removeChild(iframe);
        };
        document.body.appendChild(iframe);
    };
    // http request 拦截器
    $axios.interceptors.request.use(
        config => {
            if (
                localStorage.getItem("token") &&
                JSON.parse(localStorage.getItem("token")).token
            ) {
                // 判断是否存在token，如果存在的话，则每个http header都加上token
                Object.assign(config.headers, {
                    "login-token": JSON.parse(localStorage.getItem("token"))
                        .token
                });
                config.headers["login-token"] = JSON.parse(
                    localStorage.getItem("token")
                ).token;
            } else {
                // iView.Message.warning('token缺失或过期，请先登录获取token');
                haveToken = false;
                kldConfirm({
                    title: "提示",
                    content: `token缺失或过期，请先登录账号获取token后再返回该页面进行操作`,
                    maskClosable: false, //是否允许点击遮罩关闭 默认:false
                    ok: () => {
                        //当点击了确认按钮时
                        // console.log(window.location.href.indexOf('/countrytype2605'));
                        // console.log(location.href.slice(0,window.location.href.indexOf('/countrytype2605')))
                        window.location.href = window.location.origin;
                    }
                });
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
            if (
                response.headers &&
                (response.headers["content-type"] ===
                    "application/x-msdownload" ||
                    response.headers["content-type"] ===
                        "application/x-download;charset=UTF-8" ||
                    response.headers["content-type"] ===
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
            ) {
                downloadUrl(response.request.responseURL);
            }
            return response;
        },
        error => {
            console.log(error);
            const status = error.response ? error.response.status : null;

            //如果连续遇到相同状态码的错误就清除之前的报错提示
            //状态码为null则视为未连接服务器
            if (lastStatus === status) {
                iView.Message.destroy();
            }

            lastStatus = status;

            if (status === null && haveToken) {
                // debugger
                iView.Message.warning("未连接到服务器");
            } else {
                const errorMessage =
                    error.response.data && error.response.data.message;

                switch (status) {
                    case 401:
                        // 返回 401 清除token信息并跳转到登录页面
                        localStorage.removeItem("token");
                        localStorage.removeItem("user_in");
                        kldConfirm({
                            title: "提示",
                            content: `token缺失或过期，请先登录账号获取token后再返回该页面进行操作`,
                            maskClosable: false, //是否允许点击遮罩关闭 默认:false
                            ok: () => {
                                //当点击了确认按钮时
                                // console.log(location.href.slice(0,window.location.href.indexOf('/countrytype2605')))
                                window.location.href = window.location.origin;
                            }
                        });

                        break;
                    case 400:
                        iView.Message.warning(errorMessage);
                        break;
                    case 500:
                    case 504:
                        iView.Message.warning("您的请求暂无响应，请检查网络，稍后再试");
                        break;
                }
            }

            return Promise.reject(error);
        }
    );
    return $axios;
})(axios, $, iview, plugins);
