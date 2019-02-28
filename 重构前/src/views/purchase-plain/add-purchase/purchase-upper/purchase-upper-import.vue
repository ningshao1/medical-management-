<template>
    <div class="purchase-upper-wrap">
        <header>
            <kld-step
                :data='stepName'
                :current='step'
                class="kld-step"
            ></kld-step>
        </header>
        <!-- 采购详情 -->
        <div class="application-plan-detail">
            <component
                :is="application"
                :isCollapse='true'
                :data='UpperDetail'
                :isDetail="true"
                v-if="isDefined(isUpper)"
            ></component>
            <kld-collapse
                v-else
                :open="false"
                title="申请计划详情"
            >
                <div class='detail-white'></div>
            </kld-collapse>
        </div>

        <template v-if="isView[0]">

            <!-- 进口设备论证 -->
            <div
                class='import-wrap'
                v-if="oldDetail"
            >
                <kld-collapse
                    :open='oldDetail.procurementState<5&&oldDetail.procurementState>=2'
                    :title='"进口设备论证"'
                >
                    <div>
                        <text-upload
                            :Type='5'
                            :DetailInfo='oldDetail'
                            :Detail='importDetail'
                            :textareaData.sync='demonstrationApply'
                            :options='importOptions'
                            ref='import'
                            :uploadOption='uploadOption'
                            :UpLoadDateURL='importUpLoadDateURL()'
                            :DetailfileURL='importDetailfileURL'
                        >
                        </text-upload>
                    </div>
                </kld-collapse>
            </div>
        </template>
        <template v-if="isView[1]">
            <!-- 技术参数详情 -->
            <kld-collapse
                :open='oldDetail.procurementState<8'
                :title='"技术参数详情"'
            >
                <div>
                    <text-upload
                        :Type='8'
                        :DetailInfo='oldDetail'
                        :Detail='parameterDetail'
                        :textareaData.sync='parameterApply'
                        :options='options'
                        ref='Specification'
                        :uploadOption='uploadOption'
                        :UpLoadDateURL='UpLoadDateURL()'
                        :DetailfileURL='DetailfileURL'
                    >
                    </text-upload>
                </div>
            </kld-collapse>
        </template>
        <template v-if="isView[2]">
            <!-- 招标对内公示 -->
            <div>
                <kld-collapse
                    :open='oldDetail.procurementState>=8'
                    :title='"对内公示"'
                >
                    <div>
                        <text-upload
                            ref='publicity'
                            :DetailInfo='oldDetail'
                            :Detail='OpenDetail'
                            :uploadOption='uploadOption'
                            :UpLoadDateURL='publicityUpLoadDateUrl()'
                            :DetailfileURL='openFileURL'
                        >
                            <p class="open-title">
                                招标说明
                            </p>
                            <div class="open-time">
                                <Form
                                    ref="formInline"
                                    inline
                                    :label-width="100"
                                    :model="openData"
                                    :rules='openRule'
                                >
                                    <FormItem
                                        prop="bidTime"
                                        label="开标时间："
                                    >
                                        <DatePicker
                                            transfer
                                            :disabled='OpenDetail'
                                            :value="openData.bidTime"
                                            @on-change='openData.bidTime=$event'
                                            type="date"
                                            placeholder="请选择开标日期"
                                            style="width: 200px"
                                        ></DatePicker>
                                    </FormItem>
                                    <FormItem
                                        prop="bidAddress"
                                        label="开标地点："
                                    >
                                        <Input
                                            :disabled='OpenDetail'
                                            v-model="openData.bidAddress"
                                            placeholder="请输入开标地点"
                                            style="width: 200px"
                                        ></Input>
                                    </FormItem>
                                </Form>
                            </div>
                        </text-upload>
                    </div>
                </kld-collapse>
            </div>
        </template>

        <div class="under-btn">
            <Button
                type="primary"
                @click="back"
            >返回</Button>
            <Button
                type="primary"
                @click="cancelPurchase"
                v-if="showPurchase"
            >撤回申请</Button>
            <Button
                type="primary"
                @click="backPurchaseState"
                v-if="showBack"
            >打回申请</Button>

            <Button
                type="primary"
                @click="saveData"
                v-if="showSave"
            >保存</Button>
            <Button
                type="primary"
                @click="postData"
                v-if="showPost"
                :loading='postLoading'
            >提交</Button>
        </div>
        <Modal
            v-model="backChunk.modal"
            title="提示"
            class="purchase-upper-import-modal"
        >
            <div class="modal-content">
                <span class="modal-tips">
                    是否确定打回申请？
                </span>
                <div class="modal-tips-content">
                    <i-input
                        v-model='backChunk.content'
                        type="textarea"
                        :maxlength='500'
                        :autosize="{minRows:3}"
                        placeholder="请注明打回申请的理由"
                    ></i-input>
                </div>
            </div>
            <div
                slot="footer"
                class="purchase-upper-import-modal-footer"
            >
                <i-button
                    class="kld-btn-default"
                    @click="backChunk.modal=false"
                >
                    返回
                </i-button>
                <i-button
                    class="kld-btn"
                    @click='queryback'
                >
                    确定
                </i-button>
            </div>

        </Modal>
    </div>
</template>

<script>
import kldStep from "@common/step";
const applicationPlanUnder = () =>
    import("../../../annual-plain/add-annual/common/application-plan/index.vue"); //0~50万详情
const applicationPlanupper = () =>
    import("../../../annual-plain/add-annual-fifty/steps-components/step1/index"); //50万以上详情

import kldCollapse from "../../../annual-plain/add-annual-fifty/common/kld-collapse/index.vue";
import textUpload from "../common/components/text-upload/index";
import kldConfirm from "@common/kld-confirm";
const downloadFile = (url, filename) => {
    const link = document.createElement("a");
    link.setAttribute("download", filename || "");
    link.setAttribute("href", url);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export default {
    name: "purchase-upper-import",
    components: {
        kldStep,
        kldCollapse,
        textUpload
    },
    computed: {
        step() {
            if (!this.oldDetail) {
                return 0;
            }
            let state = this.oldDetail.procurementState;
            let steps = [
                {
                    range: [2, 3, 4],
                    step: 1
                },
                {
                    range: [5, 6, 7],
                    step: 2
                },
                {
                    range: [8],
                    step: 3
                },
                {
                    range: [9],
                    step: 4
                }
            ];
            let item = steps.find(v => v.range.includes(state));
            return item ? item.step : 0;
        },
        application() {
            //采购详情模块
            return this.isUpper ? applicationPlanupper : applicationPlanUnder;
        },
        isView() {
            if (!this.oldDetail) {
                return [];
            }

            let importView, technologyView, publicityView;
            {
                //进口
                importView = true;
            }
            {
                //技术

                technologyView = this.oldDetail.procurementState >= 5;
            }
            {
                //公示
                publicityView = this.oldDetail.procurementState >= 8;
            }
            return [importView, technologyView, publicityView];
        },
        stepName() {
            return [
                "提交申请",
                "进口设备论证审批",
                "技术参数审批",
                "招标对内公开"
            ];
        },
        id() {
            return this.$route.params.id;
        },

        uploadOption() {
            return {
                accept: [".doc", ".xls", ".xlsx", ".wps", ".docx"],
                maxSize: 3072 * 1024
            };
        },
        importDetail() {
            if (!this.oldDetail) {
                return true;
            }
            // debugger;
            if ([5, 6, 7, 8, 9].includes(this.oldDetail.procurementState)) {
                return true;
            }
            if ([2, 4].includes(this.oldDetail.procurementState)) {
                if (!this.checkLimit("purchase:demonstration:add")) {
                    return true;
                }
                //判断是否为2
                if (this.oldDetail.demonstrationApplyUserId !== null) {
                    //判断是否有创建人
                    // debugger
                    if (
                        this.oldDetail.demonstrationApplyUserId === //如果 创建人和操作人相同 就返回false
                        this.$store.state.user_in.id
                    ) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            } else if (this.oldDetail.procurementState === 3) {
                // debugger
                if (!this.checkLimit("purchase:demonstration:approve")) {
                    return true;
                }
                if (this.oldDetail.demonstrationApproveUserId !== null) {
                    if (
                        this.oldDetail.demonstrationApproveUserId === //如果 审批人和操作人相同 就返回false
                        this.$store.state.user_in.id
                    ) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            } else {
                return true;
            }
        },
        //技术参数审批
        parameterDetail() {
            if (!this.oldDetail) {
                return true;
            }
            if ([8, 9].includes(this.oldDetail.procurementState)) {
                return true;
            }
            //1-待申请2-已申请  3-进口论证审批中4-进口论证审批不通过5-进口论证审批通过6-设备参数审批中7-设备参数审批不通过8-设备参数审批通过9-已公示
            if ([5, 7].includes(this.oldDetail.procurementState)) {
                if (!this.checkLimit("purchase:parameter:add")) {
                    return true;
                }
                //判断是否为2
                if (this.oldDetail.parameterApplyUserId !== null) {
                    //判断是否有创建人
                    if (
                        this.oldDetail.parameterApplyUserId === //如果 创建人和操作人相同 就返回false
                        this.$store.state.user_in.id
                    ) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            } else if (this.oldDetail.procurementState === 6) {
                if (!this.checkLimit("purchase:parameter:approve")) {
                    return true;
                }
                if (this.oldDetail.parameterApproveUserId !== null) {
                    if (
                        this.oldDetail.parameterApproveUserId === //如果 审批人和操作人相同 就返回false
                        this.$store.state.user_in.id
                    ) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            } else {
                return true;
            }
        },
        OpenDetail() {
            if (!this.oldDetail) {
                return true;
            }

            return this.oldDetail.procurementState > 8
                ? true
                : !this.checkLimit("purchase:publicity");
        },
        //控制提交按钮的显示隐藏
        showPost() {
            if (!this.oldDetail) {
                return false;
            }
            let state = this.oldDetail.procurementState;
            let loginId = this.$store.state.user_in.id;
            if (state > 8) {
                return false;
            }
            if (state === 8) {
                return this.checkLimit("purchase:publicity");
            }

            if ([2, 4].includes(state)) {
                //进口申请
                if (!this.checkLimit("purchase:demonstration:add")) {
                    return false;
                }
                if (this.oldDetail.demonstrationApplyUserId !== null) {
                    return this.oldDetail.demonstrationApplyUserId === loginId;
                } else {
                    return true;
                }
            }
            if ([3].includes(state)) {
                //进口审批
                if (!this.checkLimit("purchase:demonstration:approve")) {
                    return false;
                }
                if (this.oldDetail.demonstrationApproveUserId !== null) {
                    return (
                        this.oldDetail.demonstrationApproveUserId === loginId
                    );
                } else {
                    return true;
                }
            }
            if ([5, 7].includes(state)) {
                //技术申请
                if (!this.checkLimit("purchase:parameter:add")) {
                    return false;
                }
                if (this.oldDetail.parameterApplyUserId !== null) {
                    return this.oldDetail.parameterApplyUserId === loginId;
                } else {
                    return true;
                }
            }
            if ([6].includes(state)) {
                //技术审批
                if (!this.checkLimit("purchase:parameter:approve")) {
                    return false;
                }
                if (this.oldDetail.parameterApproveUserId !== null) {
                    return this.oldDetail.parameterApproveUserId === loginId;
                } else {
                    return true;
                }
            }
        },

        showSave() {
            if (!this.oldDetail) {
                return false;
            }
            let state = this.oldDetail.procurementState;
            let loginId = this.$store.state.user_in.id;
            if (state >= 8) {
                return false;
            }

            if ([2, 4].includes(state)) {
                //进口申请
                if (!this.checkLimit("purchase:demonstration:add")) {
                    return false;
                }
                if (this.oldDetail.demonstrationApplyUserId !== null) {
                    return this.oldDetail.demonstrationApplyUserId === loginId;
                } else {
                    return true;
                }
            }
            if ([3].includes(state)) {
                //进口审批
                if (!this.checkLimit("purchase:demonstration:approve")) {
                    return false;
                }
                if (this.oldDetail.demonstrationApproveUserId !== null) {
                    return (
                        this.oldDetail.demonstrationApproveUserId === loginId
                    );
                } else {
                    return true;
                }
            }
            if ([5, 7].includes(state)) {
                //技术申请
                if (!this.checkLimit("purchase:parameter:add")) {
                    return false;
                }
                if (this.oldDetail.parameterApplyUserId !== null) {
                    return this.oldDetail.parameterApplyUserId === loginId;
                } else {
                    return true;
                }
            }
            if ([6].includes(state)) {
                //技术审批
                if (!this.checkLimit("purchase:parameter:approve")) {
                    return false;
                }
                if (this.oldDetail.parameterApproveUserId !== null) {
                    return this.oldDetail.parameterApproveUserId === loginId;
                } else {
                    return true;
                }
            }
        },
        showBack() {
            if (!this.oldDetail) {
                return false;
            }
            if (this.oldDetail.procurementState === 3) {
                if (!this.checkLimit("purchase:demonstration:approve")) {
                    return false;
                }
                if (this.oldDetail.demonstrationApproveUserId !== null) {
                    if (
                        this.oldDetail.demonstrationApproveUserId ===
                        this.$store.state.user_in.id
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            }
            if (this.oldDetail.procurementState === 6) {
                if (!this.checkLimit("purchase:parameter:approve")) {
                    return false;
                }
                if (this.oldDetail.parameterApproveUserId !== null) {
                    if (
                        this.oldDetail.parameterApproveUserId ===
                        this.$store.state.user_in.id
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            }
        },
        showPurchase() {
            if (!this.oldDetail) {
                return false;
            }
            if (this.oldDetail.procurementState === 2) {
                if (
                    this.oldDetail.demonstrationApplyUserId === null && //点击保存后不能撤销
                    this.$store.state.user_in.id ===
                        this.oldDetail.purchaseUserId
                ) {
                    return true;
                } else {
                    false;
                }
            } else {
                return false;
            }
        }
    },
    data() {
        return {
            isUpper: null, //是否是50万以上,
            UpperDetail: {},
            postLoading: false,

            oldDetail: null, //初始采购信息
            //procurementState 1-待申请2-已申请3-进口论证审批中4-进口论证审批不通过5-进口论证审批通过6-设备参数审批中7-设备参数审批不通过8-设备参数审批通过9-已公示
            //文件上传 25--（论证申请） 26--（论证审批）27--（参数说明申请） 28--（参数说明审批）29--对内公示

            demonstrationApply: "", //进口论证textarea
            importDetailfileURL: [], //进口文件回显数据

            parameterApply: "", //技术论证textarea
            DetailfileURL: [], //技术论证文件回显

            openData: {
                //公示信息
                bidAddress: "",
                bidTime: ""
            },
            openRule: {
                bidAddress: [
                    {
                        required: true,
                        message: "该项为必填项"
                    }
                ],
                bidTime: [
                    {
                        required: true,
                        message: "该项为必填项"
                    }
                ]
            },
            openFileURL: [], //公示文件回显
            importOptions: {
                title: "论证申请:",
                placeholder:
                    "采购单位为了满足临床使用需要，【设备名称】需具备如下功能要求：",
                rows: 6,
                fileName: "进口设备论证详情"
            },
            options: {
                title: "参数说明申请:",
                placeholder:
                    "采购单位为了满足临床使用需要，【设备名称】需具备如下功能要求：",
                rows: 6,
                fileName: "论证设备详情"
            },
            backChunk: {
                modal: false,
                content: ""
            }
        };
    },
    methods: {
        //methods
        isDefined(temp) {
            return temp !== undefined && temp !== null;
        },
        //business
        loadAllDetail() {
            //获得采购详情
            this.$axios
                .post(`/purchase/getPurchase/${this.id}`)
                .then(({ data }) => {
                    const { annualplanId, apPlanType } = data;
                    this.oldDetail = JSON.parse(JSON.stringify(data));
                    this.loadAnnualDetail(annualplanId, apPlanType);

                    {
                        //进口设备

                        //TODO进口申请和审批

                        //技术申请和审批
                        // this.demonstrationApply = [2, 4].includes(
                        //     data.procurementState
                        // )
                        //     ? data.demonstrationApply
                        //     : data.demonstrationApprove === null
                        //     ? data.demonstrationApply
                        //     : data.demonstrationApprove;

                        this.demonstrationApply =
                            data.demonstrationApprove === null
                                ? data.demonstrationApply
                                : data.demonstrationApprove;
                        //申请
                        if ([4].includes(data.procurementState)) {
                            this.demonstrationApply = data.demonstrationApply;
                        }

                        const fileURL = [];
                        let fileType;
                        if (data.files instanceof Array) {
                            fileURL.push(
                                ...data.files.filter(
                                    v => v.type === 25 || v.type === 26
                                )
                            );
                        }
                        if (data.photos instanceof Array) {
                            fileURL.push(...data.photos);
                        }
                        this.importDetailfileURL = fileURL; //进口信息回填

                        if (data.procurementState >= 5) {
                            //技术申请和审批
                            this.parameterApply =
                                data.parameterApprove === null
                                    ? data.parameterApply
                                    : data.parameterApprove;

                            //申请
                            if ([7].includes(data.procurementState)) {
                                this.parameterApply = data.parameterApply;
                            }

                            const fileURL = [];
                            let fileType;
                            if (data.files instanceof Array) {
                                fileURL.push(
                                    ...data.files.filter(
                                        v => v.type === 27 || v.type === 28
                                    )
                                );
                            }
                            if (data.photos instanceof Array) {
                                fileURL.push(...data.photos);
                            }
                            this.DetailfileURL = fileURL; //技术信息回填
                            //TODO招标信息回填
                            this.openFileURL = data.files.filter(
                                v => v.type === 29
                            );
                            this.openData = {
                                bidTime: data.bidTime,
                                bidAddress: data.bidAddress
                            };
                        }
                    }
                });
        },

        loadAnnualDetail(annualplanId, planType) {
            //获得年度计划详情

            this.$axios
                .get(`annualPlanTmp/${annualplanId}?type=${planType}`)
                .then(({ data: annualplanData }) => {
                    {
                        let isUpper = planType >= 2;
                        if (!isUpper) {
                            //50万以下
                            this.$store.commit("SetPlanDetail", annualplanData);
                        } else {
                            //50万以上
                            this.UpperDetail = annualplanData;
                        }
                        this.isUpper = isUpper;
                    }
                });
        },
        importUpLoadDateURL() {
            //进口上传文件接口
            if (!this.oldDetail) {
                return [""];
            }
            if (![2, 3, 4].includes(this.oldDetail.procurementState)) {
                this.importOptions.title = "设备论证申请";
                return [""];
            }

            let type;
            if ([2, 4].includes(this.oldDetail.procurementState)) {
                this.importOptions.title = "设备论证申请";
                type = 25;
            }
            if ([3].includes(this.oldDetail.procurementState)) {
                this.importOptions.title = "设备论证审批";
                type = 26;
            }

            return [
                `purchase/${
                    this.$store.state.user_in.osId
                }/uploadPurchasePlan/${this.id}/${type}`
            ];
        },
        UpLoadDateURL() {
            //技术上传文件接口
            if (!this.oldDetail) {
                return [""];
            }
            if (![5, 6, 7].includes(this.oldDetail.procurementState)) {
                this.options.title = "参数说明申请";
                return [""];
            }

            let type;
            if ([5, 7].includes(this.oldDetail.procurementState)) {
                this.options.title = "参数说明申请";
                type = 27;
            }
            if ([6].includes(this.oldDetail.procurementState)) {
                this.options.title = "参数说明审批";
                type = 28;
            }

            return [
                `purchase/${
                    this.$store.state.user_in.osId
                }/uploadPurchasePlan/${this.id}/${type}`
            ];
        },
        publicityUpLoadDateUrl() {
            //公示上传文件接口
            if (!this.oldDetail) {
                return [""];
            }
            if (![8].includes(this.oldDetail.procurementState)) {
                return [""];
            }
            let type = 29;
            return [
                `purchase/${
                    this.$store.state.user_in.osId
                }/uploadPurchasePlan/${this.id}/${type}`
            ];
        },

        cancelPurchase() {
            //撤销申请
            kldConfirm({
                title: "提示",
                content: "是否确定撤销申请？",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "返回", //确认取消文本  默认:取消
                ok: () => {
                    this.$axios
                        .post(`/purchase/cancelPurchase/${this.id}`)
                        .then(() => {
                            this.$Message.success("撤销成功");
                            this.$router.go(-1);
                        });
                }
            });
        },
        backPurchaseState() {
            this.backChunk.modal = true;
            //打回申请
            // kldConfirm({
            //     title: "提示",
            //     content: "是否确定打回申请？",
            //     maskClosable: false, //是否允许点击遮罩关闭 默认:false
            //     okText: "确定", //确认按钮文本  默认:确认
            //     cancelText: "返回", //确认取消文本  默认:取消
            //     ok: () => {
            //         this.$axios
            //             .post(`/purchase/backPurchaseState`, {
            //                 purchaseId: this.id,
            //             })
            //             .then(() => {
            //                 this.$Message.success("打回申请成功");
            //                 this.$router.go(-1);
            //             });
            //     }
            // });
        },
        async queryback() {
            this.backChunk.modal = false;
            const requestBody = {
                purchaseId: this.id,
                content: this.backChunk.content
            };
            await this.$axios.post(`/purchase/backPurchaseState`, requestBody);
            this.$Message.success("打回申请成功");
            this.$router.go(-1);
        },
        saveData() {
            //保存

            kldConfirm({
                title: "提示",
                content: "确定保存吗",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "返回", //确认取消文本  默认:取消
                ok: () => {
                    this.doSave();
                }
            });
        },
        doSave() {
            let status = this.oldDetail.procurementState;
            if ([2, 4].includes(status)) {
                this.importApplySave(); //申请人进口保存
            }
            if ([3].includes(status)) {
                this.importApproveSave(); //审批人进口保存
            }

            if ([5, 7].includes(status)) {
                //申请人技术保存
                this.SpecificationSave();
            }
            if ([6].includes(status)) {
                //审批人技术保存
                this.approvePurchase();
            }
        },
        importApplySave() {
            //申请人进口保存
            this.$refs["import"].uploadFile().then(data => {
                this.$axios
                    .post(`/purchase/savePurchaseByDemonstration`, {
                        purchaseId: this.id,
                        demonstrationApply: this.demonstrationApply
                    })
                    .then(() => {
                        this.$Message.success("保存成功");
                        this.$router.go(-1);
                    });
            });
        },
        importApproveSave() {
            //审批人进口保存
            this.$refs["import"].uploadFile().then(data => {
                this.$axios
                    .post(`/purchase/approvePurchaseByDemonstration`, {
                        demonstrationApprove: this.demonstrationApply,
                        purchaseId: this.id
                    })
                    .then(() => {
                        this.$Message.success("保存成功");
                        this.$router.go(-1);
                    });
            });
        },

        SpecificationSave() {
            //申请人技术保存
            this.$refs["Specification"].uploadFile().then(data => {
                this.$axios
                    .post(`/purchase/savePurchase`, {
                        purchaseId: this.id,
                        parameterApply: this.parameterApply
                    })
                    .then(() => {
                        this.$Message.success("保存成功");
                        this.$router.go(-1);
                    });
            });
        },

        approvePurchase() {
            //审批人技术保存
            this.$refs["Specification"].uploadFile().then(data => {
                this.$axios
                    .post(`/purchase/approvePurchase`, {
                        parameterApprove: this.parameterApply,
                        purchaseId: this.id
                    })
                    .then(() => {
                        this.$Message.success("保存成功");
                        this.$router.go(-1);
                    });
            });
        },
        postData() {
            //提交数据
            if (
                [8].includes(this.oldDetail.procurementState) &&
                this.$refs["publicity"].file.length <= 0
            ) {
                return this.$Message.warning("文件上传为必填项");
            }
            kldConfirm({
                title: "提示",
                content: "确定提交吗",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "返回", //确认取消文本  默认:取消
                ok: () => {
                    this.doPost();
                }
            });
        },
        doPost() {
            let status = this.oldDetail.procurementState;
            if ([8].includes(status)) {
                //公示提交
                this.commit();
                return;
            }

            if ([2, 4].includes(status)) {
                this.importApplyCommit(); //申请人进口提交
            }
            if ([3].includes(status)) {
                this.importApproveCommit(); //审批人进口提交
            }

            if ([5, 7].includes(status)) {
                //申请人技术提交
                this.SpecificationPost();
            }
            if ([6].includes(status)) {
                //审批人技术提交
                this.commitApprove();
            }
        },
        importApplyCommit() {
            //申请人进口提交
            this.postLoading = true;
            this.$refs["import"]
                .uploadFile()
                .then(data => {
                    return this.$axios.post(
                        `/purchase/commitApplyByDemonstration`,
                        {
                            purchaseId: this.id,
                            demonstrationApply: this.demonstrationApply
                        }
                    );
                })
                .then(() => {
                    this.$Message.success("提交成功");
                    this.$router.go(-1);
                })
                .finally(() => {
                    this.postLoading = false;
                });
        },
        importApproveCommit() {
            //审批人进口提交
            this.postLoading = true;
            this.$refs["import"]
                .uploadFile()
                .then(data => {
                    let modifyState = [];
                    const NewName = this.$refs["import"].addFile.map(v => {
                        return {
                            name: v.name,
                            flag: 1
                        };
                    });
                    const delName = [];
                    this.$refs["import"].removeFiles.map(v => {
                        if (v.type.split("-kld-")[0] == "25") {
                            delName.push({
                                name: v.name,
                                flag: 2
                            });
                        }
                    });
                    const oldDtetailFileName = [],
                        oldDtetailDelFileName = [];
                    this.oldDetail.files instanceof Array &&
                        this.oldDetail.files.map(v => {
                            if (v.type === 26 && v.flag === 1) {
                                oldDtetailFileName.push({
                                    name: v.name,
                                    flag: v.flag
                                });
                            }
                            if (v.type === 25 && v.flag === 2) {
                                oldDtetailDelFileName.push({
                                    name: v.name,
                                    flag: v.flag
                                });
                            }
                        });
                    const files = NewName.concat(
                        delName,
                        oldDtetailFileName,
                        oldDtetailDelFileName
                    ).length
                        ? NewName.concat(
                              delName,
                              oldDtetailFileName,
                              oldDtetailDelFileName
                          )
                        : null;
                    if (
                        this.oldDetail.demonstrationApply !==
                        this.demonstrationApply
                    ) {
                        modifyState.push(1);
                    }
                    if (NewName.concat(oldDtetailFileName).length) {
                        modifyState.push(2);
                    }
                    if (delName.concat(oldDtetailDelFileName).length) {
                        modifyState.push(3);
                    }
                    return this.$axios.post(
                        `/purchase/commitApproveByDemonstration`,
                        {
                            demonstrationApprove: this.demonstrationApply,
                            purchaseId: this.id,
                            modifyState,
                            files
                        }
                    );
                })
                .then(() => {
                    this.$Message.success("提交成功");
                    this.$router.go(-1);
                })
                .finally(() => {
                    this.postLoading = false;
                });
        },
        //申请人技术提交
        SpecificationPost() {
            this.postLoading = true;
            this.$refs["Specification"]
                .uploadFile()
                .then(data => {
                    return this.$axios.post(`/purchase/commitApply`, {
                        purchaseId: this.id,
                        parameterApply: this.parameterApply
                    });
                })
                .then(() => {
                    this.$Message.success("提交成功");
                    this.$router.go(-1);
                })
                .finally(() => {
                    this.postLoading = false;
                });
        },
        //审批人技术提交
        commitApprove() {
            this.postLoading = true;
            this.$refs["Specification"]
                .uploadFile()
                .then(data => {
                    let modifyState = [];
                    const NewName = this.$refs["Specification"].addFile.map(
                        v => {
                            return {
                                name: v.name,
                                flag: 1
                            };
                        }
                    );
                    const delName = [];
                    this.$refs["Specification"].removeFiles.map(v => {
                        if (v.type.split("-kld-")[0] == "27") {
                            delName.push({
                                name: v.name,
                                flag: 2
                            });
                        }
                    });
                    const oldDtetailFileName = [],
                        oldDtetailDelFileName = [];
                    this.oldDetail.files instanceof Array &&
                        this.oldDetail.files.map(v => {
                            if (v.type === 28 && v.flag === 1) {
                                oldDtetailFileName.push({
                                    name: v.name,
                                    flag: v.flag
                                });
                            }
                            if (v.type === 27 && v.flag === 2) {
                                oldDtetailDelFileName.push({
                                    name: v.name,
                                    flag: v.flag
                                });
                            }
                        });
                    const files = NewName.concat(
                        delName,
                        oldDtetailFileName,
                        oldDtetailDelFileName
                    ).length
                        ? NewName.concat(
                              delName,
                              oldDtetailFileName,
                              oldDtetailDelFileName
                          )
                        : null;
                    if (this.oldDetail.parameterApply !== this.parameterApply) {
                        modifyState.push(1);
                    }
                    if (NewName.concat(oldDtetailFileName).length) {
                        modifyState.push(2);
                    }
                    if (delName.concat(oldDtetailDelFileName).length) {
                        modifyState.push(3);
                    }
                    return this.$axios.post(`/purchase/commitApprove`, {
                        parameterApprove: this.parameterApply,
                        purchaseId: this.id,
                        modifyState,
                        files
                    });
                })
                .then(() => {
                    this.$Message.success("提交成功");
                    this.$router.go(-1);
                })
                .finally(() => {
                    this.postLoading = false;
                });
        },

        commit() {
            this.$refs["formInline"].validate(valid => {
                if (!valid) return;
                this.postLoading = true;
                this.$refs["publicity"]
                    .uploadFile()
                    .then(() => {
                        return this.$axios.post(`/purchase/commit`, {
                            ...this.openData,
                            purchaseId: this.id
                        });
                    })
                    .then(() => {
                        this.$Message.success("提交成功");
                        this.$router.go(-1);
                    })
                    .finally(() => {
                        this.postLoading = false;
                    });
            });
        },

        back() {
            //返回
            kldConfirm({
                title: "提示",
                content: "确定返回吗",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "返回", //确认取消文本  默认:取消
                ok: () => {
                    this.$router.go(-1);
                }
            });
        }
    },
    created() {
        this.loadAllDetail();
    }
};
</script>

<style lang="less" scoped>
.purchase-upper-wrap {
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
    .application-plan-detail {
    }
    /deep/.under-btn {
        display: flex;
        justify-content: flex-end;
        > button {
            margin: 0 6px;
        }
    }
}
.purchase-upper-import-modal {
    .modal-content {
        width: 100%;
        min-height: 100px;
        .modal-tips {
            display: block;
            margin: 20px auto 10px;
            text-align: center;
            font-size: 14px;
        }
        .modal-tips-content {
        }
    }
    .purchase-upper-import-modal-footer {
        text-align: center;
    }
}
</style>
