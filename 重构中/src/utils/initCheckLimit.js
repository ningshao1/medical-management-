import Vue from 'vue';
export default permissions => {
    if (permissions) {
        Vue.prototype.checkLimit = permission => !!permissions[permission];
    }
};
