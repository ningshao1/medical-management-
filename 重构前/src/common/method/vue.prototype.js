import vue from 'vue';
import $axios from "@/libs/new-axios";
import Address from "@common/Address";
import Util from "@/libs/util";
const upfile_ = Address; //地址挂载
//格式化日期
function data(input) {
    var d = new Date(input);
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate() < 10 ? "0" + d.getDate() : "" + d.getDate();
    var hour = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    return year + "-" + month + "-" + day;
}
//调用打印机功能
window.prints = function prints(assetCode, id) {
    try {
        var TSCObj;
        TSCObj = new ActiveXObject("TSCActiveX.TSCLIB"); //打印机使用的dll
        TSCObj.ActiveXopenport("TSC TTP-342E Pro"); //打印机名称，不能写错
        TSCObj.ActiveXsetup("40", "30", "5", "15", "0", "2", "0"); //打印机设置

        TSCObj.ActiveXsendcommand("DIRECTION 1"); //设置标签方向 ,DIRECTION 1 左上角 (x,y)={0,0};DIRECTION 0 右下角 (x,y)={0,0};
        TSCObj.ActiveXsendcommand("SET TEAR ON");
        TSCObj.ActiveXclearbuffer();
        let X_;
        var str = assetCode.toUpperCase();
        str.length == 13 ? (X_ = 45) : (X_ = 30);

        TSCObj.ActiveXwindowsfont(130, 20, X_, 270, 2, 0, "Arial", str);
        var cmd = `QRCODE 170,60,H,10,A,0,M2,S8,"${id}"`;
        TSCObj.ActiveXsendcommand(cmd);
        TSCObj.ActiveXprintlabel("1", "1"); //（打印份数,每页打印张数）
        TSCObj.ActiveXclearbuffer(); //清除
        TSCObj.ActiveXcloseport(); //关闭打印端口
        return true;
    }
    catch (error) {
        console.log(error);
        iView.Message.warning("第一次使用时请先运行bat文件");
        return false;
    }
};
//字符处理
function trCnToEn(str) {
    if (typeof str !== "string") {
        throw new TypeError(
            "parameter expect 'String' but get " + typeof str
        );
    }
    var tmp = "";
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
            // 如果位于全角！到全角～区间内
            tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
        }
        else if (str.charCodeAt(i) == 12288) {
            //全角空格的值，它没有遵从与ASCII的相对偏移，必须单独处理
            tmp += " ";
        }
        else {
            // 不处理全角空格，全角！到全角～区间外的字符
            tmp += str[i];
        }
    }
    return tmp;
};
//树排序
let $countryTreeSort = function (list) {
    function countryTreeFormat(treeList) {
        return treeList.map(type => {
            if (type.lists && type.lists.length) {
                return {
                    ...type,
                    lists: countryTreeFormat(chidrenSort(type.lists))
                };
            }
            else {
                return type;
            }
        });
    }

    function chidrenSort(treeList) {
        return treeList.sort((pre, current) => {
            if (pre.typeCode && current.typeCode) {
                let preIndex = pre.typeCode.lastIndexOf("-") + 1;
                let currentIndex = current.typeCode.lastIndexOf("-") + 1;
                return (
                    +pre.typeCode.slice(preIndex) -
                    +current.typeCode.slice(currentIndex)
                );
            }
            else {
                return pre.typeCode - current.typeCode;
            }
        });
    }
    return countryTreeFormat(chidrenSort(list));
};
vue.prototype.upfile_ = upfile_;
vue.prototype.$axios = $axios;
vue.prototype.axios = Util.ajax;
vue.prototype.time_ = data; //把处理方法添加到vue原形中
vue.prototype.prototype = trCnToEn;
vue.prototype.$countryTreeSort = $countryTreeSort;