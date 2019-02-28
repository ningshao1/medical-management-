export const PLAN_DETAIL = {
    state: {
        PlanDetail: null
    },
    mutations: {
        SetPlanDetail(state, data) {
            state.PlanDetail = data;
        },
        ClearPlanDetail(state) {
            state.PlanDetail = null;
        }
    },
    actions: {

    }
}