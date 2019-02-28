const localeNumber = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];

export default (rawNumber) => {
    const number = Number.parseInt(rawNumber);
    if (Number.isNaN(number)) {
        throw new RangeError('输入值无法解析为数字');
    } else {
        return localeNumber[number];
    }
};