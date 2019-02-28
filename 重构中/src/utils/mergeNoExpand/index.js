const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]';

const mergeNoExpand = (target, source) => {
    if (
        isObject(target) && isObject(source)
    ) {
        for (const key of Object.keys(target)) {
            if (source.hasOwnProperty(key)) {
                const sourceValue = source[key];
                if (
                    isObject(sourceValue) && isObject(target[key])
                ) {
                    mergeNoExpand(target[key], sourceValue);
                } else {
                    target[key] = sourceValue;
                }
            }
        }
    }

    return target;
};

export default mergeNoExpand;