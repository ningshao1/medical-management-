<template>
    <div>
        <header>
            <kld-step :data='stepData' class="kld-step" :current='step'></kld-step>
        </header>
        <div>
            <component :is="application" :isCollapse='true' :data='annualDetail' :isDetail="true" v-if="isDefined(isUpper)"></component>
            <kld-collapse v-else :open="false" title="申请计划详情">
                <div class='detail-white'></div>
            </kld-collapse>
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
import kldConfirm from "@/common/kld-confirm";
import skillPost from "../purchase-under/skill-post/index";
import insidePublic from "../purchase-under/inside-public/index";
import kldCollapse from "../../../annual-plain/add-annual-fifty/common/kld-collapse/index.vue";

//0~50万详情
const applicationPlanUnder = () =>
    import("../../../annual-plain/add-annual/common/application-plan/index.vue");
//50万以上详情
const applicationPlanupper = () =>
    import("../../../annual-plain/add-annual-fifty/steps-components/step1/index");

const downloadFile = (url, filename) => {
    const link = document.createElement("a");
    link.setAttribute("download", filename || "");
    link.setAttribute("href", url);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
export default {
    name: "purchase-upper",
    data() {
        return {
            stepData: ["提交申请", "技术参数审批", "招标对内公开"],
            oldDetail: {}, //用于保存详情信息,
            isUpper: null,//是否大于50万
            annualDetail: {}//年度计划详情信息
        };
    },
    components: {
        [step.name]: step,
        [skillPost.name]: skillPost,
        [insidePublic.name]: insidePublic,
        kldCollapse
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
        },
        application() {
            return this.isUpper ? applicationPlanupper : applicationPlanUnder;
        }
    },
    created() {
        this.getDetailData();
    },
    methods: {
        //methods
        isDefined(temp) {
            return temp !== undefined && temp !== null;
        },
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
                .then(({ data: annualplanData }) => {
                    // const { assetMoney } = annualplanData; //importation'1-国产  2-进口 3均可 0 没填'

                    {
                        let isUpper = apPlanType >=2;
                        if (!isUpper) {
                            //50万以下
                            this.$store.commit("SetPlanDetail", annualplanData);
                        } else {
                            //50万以上
                            this.annualDetail = annualplanData;
                        }
                        this.isUpper = isUpper;
                    }
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


