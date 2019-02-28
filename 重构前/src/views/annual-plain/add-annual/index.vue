<template>
    <div class="add-annual">
        <div class="add-annual-step">
            <kld-step class="step"
                      :data='step'
                      :current='stepNumber-1'></kld-step>
        </div>
        <div class="add-annual-content">
            <div class="annual-component">
                <loading v-if="loadingShow"></loading>
                <component :is="stepName"
                           :add='AddNumber'></component>
            </div>
            <div class="btn-shadow">
            </div>
        </div>

    </div>
</template>
<script>
import step from "@common/step/step.vue";
import step1 from "./one-step/index";
import step3 from "./three-step/index";
import step4 from "./new-tree-step/index";
import step5 from "./new-five-step/index";
import step6 from "./new-six-step/index";
import loading from "@common/loading/loading";
export default {
    name: "add-annual-plan",
    data() {
        return {
            step: [
                "提交申请",
                "委员会讨论",
                "院部讨论",
                "卫计委讨论",
                "审批通过"
            ],
            stepNumber: 1,
            loadingShow: false
        };
    },
    components: {
        [step.name]: step,
        step1,
        step3,
        step4,
        step5,
        step6,
        loading
    },
    computed: {
        stepName() {
            if (this.stepNumber === 1 || this.stepNumber === 2) {
                return "step" + 1;
            } else {
                if (
                    this.PlanDetail.unitExpertsType === 1 &&
                    this.PlanDetail.approveType === 7
                ) {
                    return "step" + (this.stepNumber - 0 + 2);
                } else {
                    return "step" + (this.stepNumber - 0 + 1);
                }
            }
        },
        PlanDetail() {
            return this.$store.state.PLAN_DETAIL.PlanDetail || {};
        }
    },
    methods: {
        AddNumber() {
            return ++this.stepNumber;
        },
        getPlanDetail() {
            this.loadingShow = true;
            this.$axios
                .get(`/annualPlanTmp/${this.$route.query.id}?type=1`)
                .then(res => {
                    this.PlanDetail = res.data;
                    this.$store.commit("SetPlanDetail", res.data);
                })
                .finally(() => {
                    this.loadingShow = false;
                })
                .catch(() => {
                    this.$store.commit("SetPlanDetail", {});
                });
        }
    },
    watch: {
        PlanDetail() {
            switch (this.PlanDetail.approveType + "") {
                case "1":
                    this.stepNumber = 2;
                    break;
                case "4":
                    this.stepNumber = 2;
                    break;
                case "6":
                    this.stepNumber = 3;
                    break;
                case "7":
                    this.stepNumber = 4;
            }
        }
    },
    created() {
        if (this.$route.query && this.$route.query.id) {
            this.getPlanDetail();
        } else {
            this.stepNumber = 1;
        }
    },
    beforeDestroy() {
        this.$store.commit("ClearPlanDetail");
    },
    beforeCreate() {
        this.$store.commit("ClearPlanDetail");
    }
};
</script>
 <style lang="less" scoped>
.add-annual {
    font-size: 14px;
    /deep/.add-annual-step {
        background: #fff;
        border-radius: 3px;
        border: solid 1px rgba(2, 31, 57, 0.1);
        margin: 0 0 20px 0;
        .c_bar {
            margin: 0 0;
        }
    }
    .add-annual-content {
        .annual-component {
            position: relative;
        }
        background-color: #fafafa;
        border-radius: 3px;
        border: solid 1px rgba(2, 31, 57, 0.1);
    }
    .btn-shadow {
        background-color: rgba(210, 210, 210, 0.5);
        border-radius: 0px 0px 3px 3px;
        opacity: 0.5;
        height: 80px;
    }
}
</style>

