import Vue from 'vue';

const routerList = [
    {
        title: "急救生命支持类设备列表",
        to: {name: "asset-by-life"}, //路由name值
        visible: Vue.prototype.checkLimit('ass:section:list')
    },
    {
        title: "设备借用列表",
        to: {name: "asset-borrow"}, //路由name值
        visible: Vue.prototype.checkLimit('borrow:list')
    },
    {
        title: "设备转移列表",
        to: {name: "asset-transfer"}, //路由name值
        visible: Vue.prototype.checkLimit('section:list')
    },
    {
        title: "闲置设备列表",
        to: {name: "asset-unused"}, //路由name值
        visible: Vue.prototype.checkLimit('Idle:list')
    },
    {
        title: "借用申请列表",
        to: {name: "asset-examine"}, //路由name值
        visible: Vue.prototype.checkLimit('borrowApply:list')
    }

].filter(({visible}) => visible !== false);
export { routerList }