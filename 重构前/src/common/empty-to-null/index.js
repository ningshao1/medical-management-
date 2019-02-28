/**
 * 将对象中的所有值为空字符串的属性转化为null
 *
 * @obj 需要转换掉对象
 * @isCopy 是否返回一个深拷贝的对象 默认为true
 * @return 返回处理完成的对象引用
 *
 * */

const emptyToNull = (obj, isCopy = true) => {
    if (obj instanceof Object) {
        if (isCopy) {
            obj = JSON.parse(JSON.stringify(obj));
        }

        for (const key of Object.keys(obj)) {
            if (obj[key] === '') {
                //当属性可写时 赋值为null
                if (Object.getOwnPropertyDescriptor(obj, key).writable) {
                    obj[key] = null;
                }
            } else if (obj[key] instanceof Object) {
                emptyToNull(obj[key], false);
            }
        }
    }

    return obj;
};

export default emptyToNull;