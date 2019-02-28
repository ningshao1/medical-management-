import axios from './axios';
import state from "../store/state.js"
// 图片批量上传
export async function uploadImg(imglist, type) {
    if (!imglist.length) {
        return [];
    }
    let config = {
        headers: { 'Content-Type': 'multipart/form-data' }
    }
    let url = `/photo/${state.userInfo.osId}/${type}/upload`
    let photosRes;
    try {
        photosRes = await Promise.all(
            imglist.map(img => {
                let data = new FormData();
                data.append('file', img);
                console.log()
                return axios.post(url, data, config);
            })
        )
    }
    catch (e) {
        return Promise.reject();
    }
    return photosRes.map(res => res.data);
};

//地址转换成文件
export function urlToFile(url = []) {
    const getURl = url.map(v => axios.get(v, {
        responseType: "blob"
    }))
    return axios.all(getURl).then(res => {
        const Files = [];
        res.map(blob => {
            Files.push(new File([blob.data], blob.config.url.split('/').pop()));
        })
        return Promise.resolve(Files);
    });
}

//深度克隆
export function deepClone(obj) {
    var newobj = obj.constructor === Array ? [] : {}; //constructor 属性返回对创建此对象的数组函数的引用。创建相同类型的空数据
    if (typeof obj !== 'object') {
        return;
    }
    else {
        for (var i in obj) {
            if (typeof obj[i] === 'object' && obj[i] !== null && obj[i] !== undefined) { //判断对象的这条属性是否为对象
                newobj[i] = deepClone(obj[i]); //若是对象进行嵌套调用
            }
            else {
                newobj[i] = obj[i];
            }
        }
    }
    return newobj; //返回深度克隆后的对象
}


export function isDef(value) {
    return value !== null && value !== undefined;
}

export function isValid(value) {
    // if (Array.isArray(value)) {
    //     return value.length > 0;
    // } else {
    //     return isDef(value) && value !== '';
    // }
    return isDef(value) && value !== '';
}

export { default as initCheckLimit } from './initCheckLimit.js';
export { default as VNode } from './VNode';
export * from './VNode';
export {default as isComponentInstance} from './isComponentInstance';
export {default as mergeNoExpand} from './mergeNoExpand';
export {default as download} from './download';
