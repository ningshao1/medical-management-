import router from "../router";
import {initCheckLimit} from '@/utils';
const mutations = {
    setToken(state, token) {
        state.token = token;
        window.localStorage.setItem(
            "__userToken___",
            JSON.stringify(token)
        );
    },
    removeToken(state) {
        state.token = null;
        window.localStorage.removeItem('__userToken___')
    },
    setUserInfo(state, userInfo) {
        state.userInfo = userInfo;
        window.localStorage.setItem(
            "__userInfo___",
            JSON.stringify(userInfo)
        );
    },
    removUserInfo(state) {
        state.userInfo = null;
        window.localStorage.removeItem('__userInfo___')
    },
    setLimit(state, limit) {
        state.limit = limit;
        window.localStorage.setItem(
            "__userLimit___",
            JSON.stringify(limit)
        );
        initCheckLimit(limit);
    },
    removeLimit(state) {
        state.limit = null;
        window.localStorage.removeItem('__userLimit___')
    },
    logout() {
        this.commit('removeToken');
        this.commit('removUserInfo');
        this.commit('removeLimit');
        router.push({ name: "sign" })
    }
};
export default mutations;