import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import global from './global';
import fifty from './year-plan-fifty';
import { PLAN_DETAIL } from './plan-detail' //新增年度计划获取详情

Vue.use(Vuex);


export default new Vuex.Store({
    getters,
    state,
    mutations,
    actions,
    modules: {
        fifty,
        PLAN_DETAIL
    }
})