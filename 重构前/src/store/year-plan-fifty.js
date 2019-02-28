import $axios from "../libs/new-axios.js";
const fifty = {
    state: {
        cache: null,
        planType: null,
        reportData: null,
        details: null,
        voteShow: false
    },
    getters: {},
    mutations: {
        setCache(state, newdata) {
            // console.log(newdata)
            state.cache = newdata;
        },
        setPlanType(state, newdata) {
            state.planType = +newdata;
        },
        setReportData(state, newdata) {
            state.reportData = newdata;
        },
        setDetails(state, newdata) {
            state.details = newdata;
        },
        clearAll(state) {
            state.cache = null;
            state.planType = null;
            state.reportData = null;
            state.details = null;
            state.voteShow = false;
        }
    },
    actions: {
        getCache(context, { planType }) {
            console.log(planType);
            const { commit, rootState } = context;
            // commit('setCache',33333333)
            return $axios
                .get(`/annualPlanTmp/getAnnualPlanChe?planType=${planType}`)
                .then(res => {
                    if (res.data) {
                        console.log(res.data);
                        if (planType != res.data.planType) {
                            return;
                        }
                        commit(
                            "setCache",
                            JSON.parse(JSON.stringify(res.data))
                        );
                        commit(
                            "setReportData",
                            JSON.parse(JSON.stringify(res.data))
                        );
                        return true;
                    }
                })
                .catch(error => {
                    return false;
                });
        },
        getDetails(context, options) {
            const { id, type, methods, step, vue } = options;
            const { commit, rootState, state } = context;
            $axios
                .get(`/annualPlanTmp/${id}?type=${type}`)
                .then(res => {
                    if (res.data) {
                        if (! res.data.annualPlanMore) {
                            res.data.annualPlanMore = {
                                "id": null,
                                "sectionResume": null,
                                "projectNecessity": null,
                                "configDemand": null,
                                "configPeople": null,
                                "projectSetout": null,
                                "siteSetout": null,
                                "economicAnalysis": null,
                                "workeType": 0,
                                "workVote": null,
                                "workPhotos": [],
                                "workFiles": []
                            };
                        }
                        commit("setDetails", res.data);

                        // let voteInfo = res.data.annualPlanVote.find(
                        //     v => v.userId === rootState.user_in.id
                        // );
                        // if (!voteInfo) {
                        //     state.voteShow = false;
                        //     methods.setButtonShow(false);
                        //     return;
                        // }
                        // let voteType = voteInfo.voteType;
                        //
                        // if (methods && step === 3) {
                        //     methods.setButtonShow(
                        //         voteType == 0 && vue.checkLimit("annual:vote")
                        //     );
                        //     state.voteShow =
                        //         voteType != 0 ||
                        //         vue.checkLimit("annual:upvote");
                        // }
                        // if (step !== 3) {
                        //     state.voteShow = true;
                        // }
                    }
                })
                .catch(error => {
                    state.voteShow = false;
                });
        }
    }
};
export default fifty;
