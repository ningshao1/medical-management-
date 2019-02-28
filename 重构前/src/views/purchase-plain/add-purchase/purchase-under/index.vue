<template>
    <div>
        <header>
            <kld-step :data='stepData' class="kld-step" :current='step'></kld-step>
        </header>
        <div>
            <application-plan></application-plan>
        </div>
        <div>
            <skill-Post :oldDetail='oldDetail'></skill-Post>
        </div>
        <div>
            <inside-public :oldDetail='oldDetail'></inside-public>
        </div>
    </div>
</template>
<script>
import step from "@common/step";
import PlanDetails from "../../../annual-plain/add-annual/common/application-plan/index.vue";
import kldConfirm from "@/common/kld-confirm";
import skillPost from "./skill-post/index";
import insidePublic from "./inside-public/index";
const downloadFile = (url, filename) => {
    const link = document.createElement("a");
    link.setAttribute("download", filename || "");
    link.setAttribute("href", url);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
export default {
    name: "purchase-under",
    data() {
        return {
            stepData: ["提交申请", "技术参数审批", "招标对内公开"],
            oldDetail: {} //用于保存详情信息
        };
    },
    components: {
        [step.name]: step,
        [PlanDetails.name]: PlanDetails,
        [skillPost.name]: skillPost,
        [insidePublic.name]: insidePublic
    },
    computed: {
        step() {
            if (
                this.oldDetail.procurementState === 2 ||
                this.oldDetail.procurementState === 6 ||
                this.oldDetail.procurementState === 7
            ) {
                return 1;
            } else if (this.oldDetail.procurementState === 8) {
                return 2;
            } else if (this.oldDetail.procurementState === 9) {
                return 3;
            } else {
                return 1;
            }
            // if()
        },
        id() {
            return this.$route.params.id || "575525355826188288";
        }
    },
    created() {
        this.getDetailData();
    },
    methods: {
        getDetailData() {
            this.$axios
                .post(`/purchase/getPurchase/${this.id}`)
                .then(({ data }) => {
                    this.getPlanData(data.annualplanId, data.apPlanType);
                    this.oldDetail = data;
                });
        },
        //年度计划详情
        getPlanData(id, apPlanType) {
            this.$axios
                .get(`annualPlanTmp/${id}?type=${apPlanType}`)
                .then(({ data }) => {
                    this.$store.commit("SetPlanDetail", data);
                });
        }
    }
};
</script>
<style lang="less" scoped>
header {
    border: solid 1px rgba(2, 31, 57, 0.1);
    background: #fff;
    margin: 20px 0;
    /deep/ .kld-step {
        > div {
            margin: 0;
        }
    }
}
.open-time {
    display: flex;
    .time-info:nth-of-type(2) {
        margin-left: 50px;
    }
}
.open-title {
    font-size: 14px;
    font-weight: 550;
    padding-top: 10px;
    padding-bottom: 15px;
}
/deep/.under-btn {
    display: flex;
    justify-content: flex-end;
    > button {
        margin: 0 6px;
    }
}
.ivu-modal-confirm-head-title {
}
</style>


