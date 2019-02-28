//文件地址转换成文件方法
import axios from "@/libs/new-axios";

export function FileConvert(url = []) {
    if (!(url instanceof Array)) {
        Promise.reject("参数必须是数组");
        return;
    }
    return Promise.all(
        url.map(v => {
            let fileName = "",
                url = "";
            if (v instanceof Object) {
                fileName = v.fileName;
                url = v.fileUrl;
            }
            else {
                url = v;
                fileName = url.split("/").pop();
            }
            return axios
                .get(url, {
                    responseType: "blob"
                })
                .then(({
                    data
                }) => {
                    const file = new File([data], fileName);
                    return file;
                });
        })
    );
}
//小数相乘 用于解决js计算问题
export function accMul(arg1, arg2) {
    var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {}
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {}
    return (
        (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
        Math.pow(10, m)
    );
}
//小时转换成分钟
export function chooseDate(time) {
    if (!time) return `0小时`;
    const data = /(^\d+)(\.?(\d+))?$/.exec(time);
    if (data[3] === undefined || data[3] === "0") {
        return data[1] + `小时`
    }
    else {
        return data[1] + `小时` + parseFloat(data[2]) * 60 + `分钟`
    }
}
const GetdownloadFile = url => {
    url = new URL(url);
    url.searchParams.set('login-token', JSON.parse(localStorage.getItem("token")).token);

    let iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url.href;
    iframe.onload = function () {
        document.body.removeChild(iframe);
    };
    document.body.appendChild(iframe);
}
const PostDownloadFile = (data, headers, fileName) => {
    let file = data
    const url = URL.createObjectURL(file);
    const alabel = document.createElement("a");
    alabel.setAttribute('download', fileName);
    alabel.setAttribute('href', url);
    document.body.appendChild(alabel);
    alabel.click();
    alabel.remove();
    window.URL.revokeObjectURL(url); //释放掉blob对象
}
//文件下载 post请求必须加上
export function downFile(res, fileName = '文件下载.xls', type = []) {
    const { config, headers, request: { responseURL }, data } = res;
    if (!config) return;
    const downloadMark = {
        "content-type": [
            "application/x-msdownload",
            "application/x-download;charset=UTF-8",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel;charset=utf-8",
            "application/msexcel",
            ...type
        ]
    }
    if (downloadMark["content-type"].includes(headers["content-type"])) {
        if (config.method.toLowerCase() === 'get') {
            GetdownloadFile(responseURL)
        }
        else if (config.method.toLowerCase() === 'post') {
            PostDownloadFile(data, headers, fileName);
        }
    }
}