<template>
    <div class="singer-detail-wrap">
        <Form class='view-info-form'>
            <div class="base-infos info-modules">
                <kld-type title="基础信息"></kld-type>
                <Row
                    type="flex"
                    justify="space-between"
                >
                    <i-col :span='7'>
                        <form-item label="设备名称：">
                            <div class="single-info-wrap asset-name-wrap">
                                <span
                                    class='view-details'
                                    @click="viewDetails"
                                    v-show="baseInfo.assetName"
                                >查看设备详情</span>
                                <div class="display-box">
                                    {{baseInfo.assetName}}
                                </div>
                            </div>
                        </form-item>
                    </i-col>
                    <i-col :span="7">
                        <form-item label="设备型号：">
                            <div class="single-info-wrap">
                                <div class="display-box">
                                    {{baseInfo.assetClass}}
                                </div>
                            </div>
                        </form-item>
                    </i-col>
                    <i-col :span="7">
                        <form-item label="设备编码：">
                            <div class="single-info-wrap">
                                <div class="display-box">
                                    {{baseInfo.assetCode}}
                                </div>
                            </div>
                        </form-item>
                    </i-col>
                </Row>
                <Row
                    type="flex"
                    justify="space-between"
                >
                    <i-col :span='7'>
                        <form-item label="设备类别：">
                            <div class="single-info-wrap">
                                <div class="display-box">
                                    {{baseInfo.assertTypeName}}
                                </div>
                            </div>
                        </form-item>
                    </i-col>
                    <i-col :span="7">
                        <form-item label="报修人：">
                            <div class="single-info-wrap">
                                <div class="display-box">
                                    {{singerInfo.createName}}
                                </div>
                            </div>
                        </form-item>
                    </i-col>
                    <i-col :span="7">
                        <form-item label="保修状态：">
                            <div class="single-info-wrap">
                                <div class="display-box">
                                    {{baseInfo.assetWarrntyStatus |warrntyStatus}}
                                </div>
                            </div>
                        </form-item>
                    </i-col>

                </Row>

            </div>
            <div class="singer-base-infos info-modules">
                <kld-type title="报修信息"></kld-type>
                <i-row>
                    <i-col :span='13'>
                        <form-item label="错误代码：">
                            <div class="single-info-wrap">
                                <div class="display-box">
                                    {{singerInfo.errCode}}
                                </div>
                            </div>
                        </form-item>
                    </i-col>
                    <i-col :span='13'>
                        <form-item label="报单标签：">
                            <div class="single-info-wrap">
                                <div class="display-box">
                                    <template v-if="singerInfo.labels&&singerInfo.labels.length">
                                        <i-button
                                            v-for="(v,i) of singerInfo.labels"
                                            :key="i"
                                            type="ghost"
                                            style="margin-right:15px;"
                                            shape="circle"
                                        >
                                            {{v.labelName}}
                                        </i-button>
                                    </template>
                                </div>
                            </div>
                        </form-item>
                    </i-col>
                    <i-col :span='24'>
                        <form-item label="故障描述：">
                            <div class="single-info-wrap">
                                <div class="display-box err-content-box">
                                    {{singerInfo.errContent}}
                                </div>
                            </div>
                        </form-item>
                    </i-col>
                    <i-col :span='24'>
                        <form-item label="故障图片：">
                            <div class="single-info-wrap">
                                <image-view
                                    :imgUrlList="singerInfo.photos||[]"
                                    :showStyle="{border:'1px solid #dddee1'}"
                                ></image-view>
                            </div>
                        </form-item>
                    </i-col>
                </i-row>

            </div>

        </Form>
        <div class="button-bar">
            <i-button
                class='kld-btn-default'
                @click="goBack"
            >返回</i-button>
            <template v-if="singerInfoLoaded">

                <i-button
                    v-if="checkLimit('fr:order')&&[0].includes(repairType)"
                    class='kld-btn'
                    @click="checkReceipt"
                    :loading="btnLoading.receipt"
                >接单</i-button>
                <i-button
                    v-if="checkLimit('fr:care')&&[1].includes(repairType)&&userInfo.id==singerInfo.userID"
                    class='kld-btn'
                    @click="checkApplyTransfer"
                    :loading="btnLoading.applyTransfer"
                >申请转交</i-button>
                <!-- 提交维修报告 -->
                <submit-maintenance-report
                    v-if="checkLimit('fr:acce:edit')&&[1].includes(repairType)&&userInfo.id==singerInfo.userID"
                    :singerInfo="singerInfo"
                ></submit-maintenance-report>
                <!-- 查看维修报告 -->
                <view-maintenance-report
                    v-if="checkLimit('fr:acce:query')&&[2,3].includes(repairType)"
                    :singerInfo="singerInfo"
                ></view-maintenance-report>
                <!-- 延长维修时间 -->
                <singer-delay-btn
                    v-if="checkLimit('fr:delayed')&&[1].includes(repairType)&&userInfo.id==singerInfo.userID&&singerInfo.reportdelay==1"
                    :singerInfo="singerInfo"
                ></singer-delay-btn>

                <!-- 转交 -->
                <transfer-btn
                    v-if="checkLimit('fr:transfer')&&[4].includes(repairType)"
                    :singerInfo="singerInfo"
                ></transfer-btn>

                <i-button
                    v-if="[2].includes(repairType)&&checkLimit('fr:acceptance')&&userInfo.id==singerInfo.creatorId"
                    class='kld-btn'
                    @click="checkAcceptance"
                    :loading="btnLoading.acceptance"
                >维修验收</i-button>
                <i-button
                    v-if="[0,1,4].includes(repairType)&&userInfo.id==singerInfo.creatorId"
                    class='kld-btn'
                    @click="checkRevoke"
                    :loading="btnLoading.revoke"
                >撤回报单</i-button>
                <i-button
                    v-if="[5].includes(repairType)&&userInfo.id==singerInfo.creatorId&&showReOpenBtn"
                    class='kld-btn'
                    @click="checkReopen"
                    :loading="btnLoading.reopen"
                >重新打开</i-button>
            </template>

        </div>
    </div>
</template>

<script>
import kldType from "@common/kld-type";
import imageView from "@common/imageView/ImageView";
import kldConfirm from "@common/kld-confirm/index.js";
import transferBtn from "./common/transfer-btn.vue";
import singerDelayBtn from "./common/singer-delay-btn.vue";
import submitMaintenanceReport from "./common/submit-maintenance-report";
import viewMaintenanceReport from "./common/view-maintenance-report";
export default {
    name: "singer-detail",
    components: {
        kldType,
        imageView,
        transferBtn,
        singerDelayBtn,
        submitMaintenanceReport,
        viewMaintenanceReport
    },
    data() {
        return {
            singerInfo: {},
            baseInfo: {},
            singerInfoLoaded: false,
            btnLoading: {
                receipt: false,
                revoke: false,
                reopen: false,
                applyTransfer: false,
                acceptance: false
            },
            showReOpenBtn: false
        };
    },
    computed: {
        singerId() {
            return this.$route.query.id;
        },
        userInfo() {
            return this.$store.state.user_in;
        },
        repairType() {
            return this.singerInfo.repairType;
        },
        taskId() {
            return this.singerInfo.taskId;
        }
    },
    filters: {
        warrntyStatus(value) {
            switch (value) {
                case 1:
                    return "在保";
                case 2:
                    return "过保";
                default:
                    return "未设置过保日期";
            }
        }
    },
    created() {
        this.init();
    },
    methods: {
        async init() {
            await this.loadSingerViewInfo();
            this.canReopen();
        },
        async loadSingerViewInfo() {
            this.singerInfoLoaded = false;
            const { data } = await this.$axios.get(
                `/faultReport/${this.singerId}`
            );
            data.labels = (data.labels && data.labels.filter(v => v)) || [];
            this.singerInfo = data;
            this.baseInfo = data.asset;
            this.singerInfoLoaded = true;
            return Promise.resolve(data);
        },
        async canReopen() {
            this.btnLoading.reopen = true;
            try {
                const { data } = await this.$axios.get(
                    `/faultReport/getRecallReportType?id=${this.baseInfo.id}`
                );
                this.showReOpenBtn = data ? data === 1 : false;
            } finally {
                this.btnLoading.reopen = false;
            }
        },

        viewDetails() {
            if (!this.checkLimit("ass:query")) {
                this.$Message.warning("您没有权限查看设备详情！");
                return;
            }
            let id = this.baseInfo.id;
            if (id) {
                this.$router.push({
                    name: "asset-details",
                    params: { id }
                });
            }
        },
        goBack() {
            this.$router.go(-1);
        },
        //接单
        checkReceipt() {
            kldConfirm({
                title: "确认接单",
                content: "是否确认接受此报单？",
                // maskClosable: false,  //是否允许点击遮罩关闭 默认:false
                okText: "接单", //确认按钮文本  默认:确认
                // cancelText: '取消',     //确认取消文本  默认:取消
                ok: () => {
                    //当点击了确认按钮时
                    this.receipt();
                },
                cancel: () => {
                    //取消按钮同上
                    this.$router.go(-1);
                }
            });
        },
        async receipt() {
            this.btnLoading.receipt = true;
            try {
                let putRequestBody = {
                    userID: this.userInfo.id,
                    userName: this.userInfo.name,
                    id: this.singerId
                };
                await this.$axios.put(
                    `/faultReport/acceptFaultReport/${this.singerId}`,
                    putRequestBody
                );
                // let postRequestBody = {
                //     userId: this.userInfo.loginName
                // };
                // await this.axios.post(
                //     `activiti/complete/${this.taskId}/${this.singerId}`,
                //     postRequestBody
                // );
                this.$Message.success("接单成功！");
                this.$router.go(-1);
            } finally {
                this.btnLoading.receipt = false;
            }
        },
        //维修验收
        checkAcceptance() {
            kldConfirm({
                title: "确认验收",
                content: `设备故障已维修完毕，确认验收？`,
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                ok: () => {
                    //当点击了确认按钮时
                    this.acceptance();
                }
            });
        },
        async acceptance() {
            this.btnLoading.acceptance = true;
            try {
                await this.$axios.put(
                    `/faultReport/completeFaultReport/${this.singerId}`
                );
                // await this.$axios.post(
                //     `/activiti/complete/${this.taskId}/${this.singerId}`,
                //     {}
                // );
                this.$Message.success("报单验收成功！");
                this.$router.go(-1);
            } finally {
                this.btnLoading.acceptance = false;
            }
        },
        //撤回报单
        checkRevoke() {
            kldConfirm({
                title: "提示",
                content: `是否确认撤回此报单？`,
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                ok: () => {
                    //当点击了确认按钮时
                    this.revoke();
                }
            });
        },
        async revoke() {
            this.btnLoading.revoke = true;
            try {
                await this.$axios.put(
                    `/faultReport/recallFaultReport/${this.singerId}?taskId=${
                        this.taskId
                    }`
                );

                this.$Message.success("该报单已撤回。");
                this.$router.go(-1);
            } finally {
                this.btnLoading.revoke = false;
            }
        },
        //重新打开报单
        checkReopen() {
            kldConfirm({
                title: "提示",
                content: `是否确认重新打开此报单？`,
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                ok: () => {
                    //当点击了确认按钮时
                    this.reopen();
                }
            });
        },
        reopen() {
            this.$router.push({
                name: "reopen-singer",
                params: { id: this.singerId }
            });
        },
        //申请转交
        checkApplyTransfer() {
            kldConfirm({
                title: "提示",
                content: `确认申请转交？`,
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                ok: () => {
                    //当点击了确认按钮时
                    this.applyTransfer();
                }
            });
        },
        async applyTransfer() {
            this.btnLoading.applyTransfer = true;
            try {
                await this.$axios.put(
                    `/faultReport/careFaultReport?id=${this.singerId}`
                );
                // let postRequestBody = {
                //     userIds: this.userInfo.loginName,
                //     action: "NO"
                // };
                // await this.$axios.post(
                //     `/activiti/complete/${this.taskId}/${this.singerId}`,
                //     postRequestBody
                // );
                this.$Message.success(
                    "申请转交信息已成功提交，科长正在紧急处理中。"
                );

                this.$router.go(-1);
            } finally {
                this.btnLoading.applyTransfer = false;
            }
        }
    }
};
</script>

<style lang="less" scoped>
.singer-detail-wrap {
    padding: 15px;
    width: 100%;
    border-radius: 3px;
    border: solid 1px rgba(2, 31, 57, 0.1);
    background: rgb(250, 250, 250);

    /deep/.view-info-form {
        .infoAppearance() {
        }
        .info-modules {
            width: 100%;
            padding-bottom: 15px;
        }
        .single-info-wrap {
            width: 100%;
            display: table;
            position: relative;
            &.asset-name-wrap {
                .view-details {
                    color: #5ba4c8;
                    position: absolute;
                    z-index: 20;
                    top: -30px;
                    right: 1px;
                    font-size: 14px;
                    cursor: pointer;
                    &:hover {
                        color: darken(#5ba4c8, 6.5%);
                    }
                }
            }
        }
        .display-box {
            width: 100%;
            padding: 5px;
            min-height: 44px;
            border-radius: 4px;
            border: 1px solid #dddee1;
            font-size: 14px;
            background-color: rgb(242, 242, 242);
            &.err-content-box {
                min-height: 150px;
            }
        }

        .ivu-form-item-label {
            font-size: 14px;
        }
        .ivu-col {
            margin-bottom: 15px;
        }
    }
    .button-bar {
        height: 80px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        > .ivu-btn {
            margin-right: 15px;
        }
    }
}
</style>


