const GetdownloadFile = url => {
    url = new URL(url);
    url.searchParams.set('login-token', JSON.parse(localStorage.getItem("__userToken___")).token);
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
export default function downFile(res, fileName = '文件下载.xls', type = []) {
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