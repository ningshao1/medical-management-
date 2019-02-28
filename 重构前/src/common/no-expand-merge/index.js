const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]';

const noExpandMerge = (target, source) => {
    if (
        (target instanceof Object) &&
        (source instanceof Object)
    ) {
        for (const key of Object.keys(target)) {
            if (source.hasOwnProperty(key)) {
                const sourceValue = source[key];
                if (
                    isObject(sourceValue) &&
                    isObject(target[key])
                ) {
                    noExpandMerge(target[key], sourceValue);
                } else {
                    target[key] = sourceValue;
                }
            }
        }
    }

    return target;
};

export default noExpandMerge;