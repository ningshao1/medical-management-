import Vue from 'vue';
export default permission => {
    return Vue.prototype.checkLimit(permission);
};