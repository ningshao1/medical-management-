<template>
    <div class="add-annual-fifty-wrap">
        <template v-if="downloadWordShow">
            <a class="print-annual-plan" @click="printAnnualPlan">
                打印年度计划
            </a>
            <print-details ref="prints" style="display: none;"></print-details>
            <print-detail ref="print" style="display: none;"></print-detail>
        </template>

        <Loading v-if="pageLoading"></Loading>
        <template v-else>
            <div class="kld-step-wrap">
                <kld-step :data="allStepLabels" :current="currentStep" :error="isStepError"></kld-step>
            </div>
            <div class="step-content">
                <template v-for="(step, index) in showSteps">
                    <component
                            v-if="step.component"
                            :is="step.component"
                            ref="steps-components"
                            :key="step.label"
                            :data="detailsData"
                            :is-collapse="calcIsCollapse(index)"
                            :is-detail="calcIsDetail(index)"
                    ></component>
                </template>
                <div class="bottom-config">
                    <i-button :loading="nextButtonData.loading" style="margin-left: 20px;" class="kld-btn" @click="next" v-if="nextButtonShow">{{currentNextButtonText}}</i-button>
                    <i-button v-if="isAddPage" :loading="saveCacheLoading" style="margin-left: 20px;" class="kld-btn" @click="saveCache">缓存</i-button>
                    <i-button class="kld-btn" @click="goBack">返回</i-button>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
import KldStep from "@common/step";
import steps from "./steps";
import testLimit from "@common/test-limit";
const PrintDetails = () => import("./common/print");
const printDetail = () =>
    import("../add-annual/detail-annual/print-details/index.vue");
export default {
    name: "add-annual-fifty-wrap",
    components: { KldStep, PrintDetails, printDetail },
    data() {
        return {
            nextButtonData: {
                loading: false
            },
            saveCacheLoading: false,
            pageLoading: false,
            detailsData: null,
            downloadWordLimit: testLimit("annual:word")
        };
    },
    computed: {
        query() {
            return this.$route.query;
        },

        userId() {
            return this.$store.state.user_in.id;
        },

        //是否是新增页面
        isAddPage() {
            return this.$route.name === "add-annual-fifty";
        },

        isDetail() {
            return !this.isAddPage;
        },

        allSteps() {
            return (this.isAddPage && this.query.type === "3") ||
                (this.detailsData && this.detailsData.planType === 3)
                ? steps
                : steps.filter(({ label }) => label !== "职工大会");
        },

        allStepLabels() {
            return this.allSteps.map(({ label }) => label);
        },

        showSteps() {
            return this.allSteps.slice(0, this.currentStep + 1);
        },

        //当前步数 从0开始
        currentStep() {
            if (this.isAddPage) {
                return 0;
            } else {
                if (this.detailsData) {
                    const {
                        approveType,
                        unitExpertsType,
                        planningExpertsType
                    } = this.detailsData;
                    switch (approveType) {
                        case 1:
                        case 2:
                        case 3:
                            return 0;
                        case 4:
                        case 5:
                            return 1;
                        case 6:
                            return 2;
                        case 7:
                            return 3;
                        case 8:
                            return 4;
                        case 9:
                            return this.allSteps.length;
                        case 10:
                            if (
                                unitExpertsType === 2 ||
                                planningExpertsType === 2
                            ) {
                                return 3;
                            } else {
                                return 4;
                            }
                    }
                } else {
                    return 0;
                }
            }
        },
        //当前步是否被拒绝
        isStepError() {
            if (!this.isAddPage && this.detailsData) {
                const { approveType, hospitalType } = this.detailsData;
                switch (approveType) {
                    case 5:
                    case 10:
                        return true;
                    case 6:
                        return hospitalType === 2;
                }
            }

            return false;
        },

        //当前的提交按钮显示的文本
        currentNextButtonText() {
            if (this.isAddPage) {
                return "提交申请";
            } else if (this.detailsData) {
                const { approveType } = this.detailsData;
                if (approveType === 4) {
                    return "委员会表决";
                }
            }
            return "提交";
        },
        //当前的提交按钮是否显示
        nextButtonShow() {
            if (this.isAddPage) {
                //提交缓存的时候不允许提交申请
                return !this.saveCacheLoading;
            } else if (this.detailsData) {
                const { approveType , annualPlanVote} = this.detailsData;
                switch (approveType) {
                    case 4:
                        //委员会表决
                        //当前用户包含在表决人列表中且有表决权限才可以表决
                        const {userId} = this;
                        return testLimit("annual:vote") && Boolean(annualPlanVote.find(
                            item => item.userId === userId
                        ));
                    case 6:
                        return testLimit("annual:hospital");
                    case 7:
                        return testLimit("annual:planning");
                    case 8:
                        return testLimit("annual:work");
                }
            }
            return false;
        },

        //判断是否可以打印
        downloadWordShow() {
            if (this.detailsData) {
                const { approveType } = this.detailsData;
                return (
                    this.downloadWordLimit &&
                    (approveType === 2 ||
                        approveType === 3 ||
                        approveType === 9 ||
                        this.isStepError)
                );
            } else {
                return false;
            }
        }
    },

    created() {
        this.getDetailsData(this.isAddPage);
    },

    methods: {
        async next() {
            const { nextButtonData } = this;
            try {
                const stepsComponents = this.$refs["steps-components"];
                nextButtonData.loading = true;
                await stepsComponents[stepsComponents.length - 1].submit();
            } finally {
                nextButtonData.loading = false;
            }
        },

        async saveCache() {
            try {
                const stepsComponents = this.$refs["steps-components"];
                this.saveCacheLoading = true;
                await stepsComponents[stepsComponents.length - 1].submit(true);
            } finally {
                this.saveCacheLoading = false;
            }
        },

        async getDetailsData(cache = false) {
            try {
                this.pageLoading = true;
                const { data } = await this.$axios.get(
                    cache
                        ? `/annualPlanTmp/getAnnualPlanChe?planType=${
                              this.query.type
                          }`
                        : `/annualPlanTmp/${this.query.id}?type=${
                              this.query.type
                          }`
                );
                if (data) {
                    this.detailsData = data;
                }
            } finally {
                this.pageLoading = false;
            }
        },
        goBack() {
            this.$router.go(-1);
        },

        calcIsCollapse(index) {
            if (this.isDetail && this.detailsData) {
                if (this.detailsData.approveType !== 9 && !this.isStepError) {
                    return this.showSteps.length !== index + 1;
                }
            }
            return false;
        },
        calcIsDetail(index) {
            if (this.isDetail && this.detailsData) {
                const type = this.detailsData.approveType;
                if (
                    type === 9 ||
                    type === 1 ||
                    type === 2 ||
                    type === 3 ||
                    this.isStepError
                ) {
                    return true;
                } else {
                    return this.showSteps.length !== index + 1;
                }
            }
            return false;
        },

        printAnnualPlan() {
            debugger;
            let details = this.detailsData;

            if (details && details.sectionName && details.assetName) {
                this.$refs["prints"].print(
                    details,
                    `${details.sectionName}：${details.assetName}可行性论证报告`
                );
                this.$refs["print"].print(
                    details,
                    `${details.sectionName}：${details.assetName}设备配置论证表`
                );
            } else if (details) {
                this.$refs["prints"].print(details);
                this.$refs["print"].print(details);
            } else {
                this.$Message.warning("暂时无法打印");
            }
        }
    }
};
</script>
<style lang="less" scoped>
.add-annual-fifty-wrap {
    position: relative;
    min-height: 100vh;
    .kld-step-wrap {
        background-color: #fff;
        border-radius: 3px;
    }
    .print-annual-plan {
        position: absolute;
        display: inline-block;
        top: -70px;
        right: 0px;
        width: 85px;
        font-size: 14px;
        color: #2195ec;
    }
    .step-content {
        background-color: #fafafa;
        width: 100%;
        position: relative;
        padding-bottom: 100px;
        border-radius: 3px;
        .bottom-config {
            width: 100%;
            height: 80px;
            padding: 0 15px;
            display: flex;
            flex-flow: row-reverse;
            align-items: center;
            background-color: rgba(210, 210, 210, 0.5);
            position: absolute;
            left: 0;
            bottom: 0;
        }
    }
}
</style>

