<template>
    <div v-show="skillDetail.procurementState===2||skillDetail.procurementState>5">
        <kld-collapse :open='skillDetail.procurementState<8&&skillDetail.procurementState>=2'
                      :title='"技术参数详情"'>
            <div>
                <text-upload :DetailInfo='skillDetail'
                             :Detail='parameterDetail'
                             :textareaData.sync='parameterApply'
                             :options='options'
                             ref='Specification'
                             :uploadOption='uploadOption'
                             :UpLoadDateURL='UpLoadDateURL'
                             :DetailfileURL='DetailfileURL'>
                </text-upload>
            </div>
        </kld-collapse>
        <div class="under-btn"
             v-if="skillDetail.procurementState<8">
            <Button type="primary"
                    @click="back">返回</Button>
            <Button type="primary"
                    @click="cancelPurchase"
                    v-if="showPurchase">撤回申请</Button>
            <Button type="primary"
                    @click="modal.show=true"
                    v-if="showBack">打回申请</Button>
            <Button type="primary"
                    @click="saveData"
                    v-if="showSave">保存</Button>
            <Button type="primary"
                    v-if="showPost"
                    @click="postData">提交</Button>
        </div>
        <Modal title="提示"
               v-model="modal.show"
               @on-ok='backPurchaseState'
               class-name="vertical-center-modal">
            <div class="reject-apply">
                <p>是否确定打回申请？</p>
                <i-input placeholder="请注明打回申请的理由"
                         v-model="modal.content"
                         type="textarea"
                         :maxlength='500'></i-input>
            </div>
        </Modal>
    </div>
</template>
<script>
import collapse from "../../../../annual-plain/add-annual-fifty/common/kld-collapse/index.vue";
import textUpload from "../../common/components/text-upload/index";
import kldConfirm from "@/common/kld-confirm";
export default {
    name: "skill-Post",
    props: {
        oldDetail: {
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            UpLoadDateURL: [
                `purchase/${
                    this.$store.state.user_in.osId
                }/uploadPurchasePlan/${this.id}/28
`
            ],
            parameterApply: "",
            DetailfileURL: [],
            modal: {
                show: false,
                content: ""
            }
        };
    },
    computed: {
        skillDetail() {
            return this.oldDetail || {};
        },
        options() {
            return {
                title: "参数说明申请:",
                placeholder:
                    "采购单位为了满足临床使用需要，【设备名称】需具备如下功能要求：",
                rows: 6,
                fileName: "论证设备详情"
            };
        },
        uploadOption() {
            return {
                accept: [".doc", ".docx", ".xls", ".xlsx", ".wps"],
                maxSize: 3072 * 1024
            };
        },
        id() {
            return this.$route.params.id;
        },
        parameterDetail() {
            //1-待申请2-已申请  3-进口论证审批中4-进口论证审批不通过5-进口论证审批通过6-设备参数审批中7-设备参数审批不通过8-设备参数审批通过9-已公示
            if (
                this.oldDetail.procurementState === 2 ||
                this.oldDetail.procurementState === 7
            ) {
                if (!this.ViewLimit("purchase:parameter:add")) {
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
                if (!this.ViewLimit("purchase:parameter:approve")) {
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
        //保存按钮
        showSave() {
            if (
                this.oldDetail.procurementState === 2 ||
                this.oldDetail.procurementState === 7
            ) {
                if (!this.ViewLimit("purchase:parameter:add")) {
                    return false;
                }
                if (this.oldDetail.parameterApplyUserId === null) {
                    return true;
                } else {
                    if (
                        this.oldDetail.parameterApplyUserId ===
                        this.$store.state.user_in.id
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else if (this.oldDetail.procurementState === 6) {
                if (!this.ViewLimit("purchase:parameter:approve")) {
                    return false;
                }
                if (this.oldDetail.parameterApproveUserId === null) {
                    return true;
                } else {
                    if (
                        this.oldDetail.parameterApproveUserId ===
                        this.$store.state.user_in.id
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }
        },
        //控制提交按钮的显示隐藏
        showPost() {
            if (
                this.oldDetail.procurementState === 2 ||
                this.oldDetail.procurementState === 7
            ) {
                if (!this.ViewLimit("purchase:parameter:add")) {
                    return false;
                }
                if (this.oldDetail.parameterApplyUserId === null) {
                    return true;
                } else {
                    if (
                        this.oldDetail.parameterApplyUserId ===
                        this.$store.state.user_in.id
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else if (this.oldDetail.procurementState === 6) {
                if (!this.ViewLimit("purchase:parameter:approve")) {
                    return false;
                }
                if (this.oldDetail.parameterApproveUserId === null) {
                    return true;
                } else {
                    if (
                        this.oldDetail.parameterApproveUserId ===
                        this.$store.state.user_in.id
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else if (this.oldDetail.procurementState === 8) {
                return true;
            } else {
                return false;
            }
        },
        //打回按钮
        showBack() {
            if (!this.ViewLimit("purchase:parameter:approve")) {
                return false;
            }
            if (this.oldDetail.procurementState === 6) {
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
            } else {
                return false;
            }
        },
        //撤销按钮
        showPurchase() {
            if (
                this.skillDetail.statue === 2 &&
                this.skillDetail.apImport === 2
            ) {
                //如果是进口并且是10W+ false
                return false;
            }
            if (this.oldDetail.procurementState === 2) {
                if (
                    this.oldDetail.parameterApplyUserId === null &&
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
    components: {
        [collapse.name]: collapse,
        [textUpload.name]: textUpload
    },
    watch: {
        skillDetail(data) {
            if (!Object.keys(data).length) return;
            if (data.procurementState === 2 || data.procurementState === 7) {
                this.UpLoadDateURL = [
                    `purchase/${
                        this.$store.state.user_in.osId
                    }/uploadPurchasePlan/${this.id}/27
`
                ];
            }
            if (data.procurementState === 6) {
                this.options.title = "参数说明审批";
                this.UpLoadDateURL = [
                    `purchase/${
                        this.$store.state.user_in.osId
                    }/uploadPurchasePlan/${this.id}/28
`
                ];
            }
            //参数申请和审批
            this.parameterApply =
                data.parameterApprove === null
                    ? data.parameterApply
                    : data.parameterApprove;
            if (data.procurementState === 7) {
                this.parameterApply = data.parameterApply;
            }
            const fileURL = [];
            let fileType;
            if (data.files instanceof Array) {
                fileURL.push(
                    ...data.files.filter(v => v.type === 27 || v.type === 28)
                );
            }
            if (data.photos instanceof Array) {
                fileURL.push(...data.photos);
            }
            this.DetailfileURL = fileURL;
        }
    },
    methods: {
        back() {
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
        },
        //申请人保存
        SpecificationSave() {
            this.$refs["Specification"].uploadFile().then(data => {
                this.$axios
                    .post(`/purchase/savePurchase`, {
                        purchaseId: this.id,
                        parameterApply: this.parameterApply
                    })
                    .then(() => {
                        this.$Message.success("提交成功");
                        this.$router.go(-1);
                    });
            });
        },
        SpecificationPost() {
            this.$refs["Specification"].uploadFile().then(data => {
                this.$axios
                    .post(`/purchase/commitApply`, {
                        purchaseId: this.id,
                        parameterApply: this.parameterApply
                    })
                    .then(() => {
                        this.postLoading = false;
                        this.$Message.success("提交成功");
                        this.$router.go(-1);
                    });
            });
        },
        //审批人保存
        approvePurchase() {
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
        //审批人提交
        commitApprove() {
            this.$refs["Specification"].uploadFile().then(data => {
                let modifyState = [];
                const NewName = this.$refs["Specification"].addFile.map(v => {
                    return {
                        name: v.name,
                        flag: 1
                    };
                });
                const delName = [];
                this.$refs["Specification"].removeFiles.map(v => {
                    console.log(v);
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
                console.log(delName);
                console.log(oldDtetailDelFileName);
                if (delName.concat(oldDtetailDelFileName).length) {
                    modifyState.push(3);
                }
                console.log(files);
                console.log(modifyState);
                this.$axios
                    .post(`/purchase/commitApprove`, {
                        parameterApprove: this.parameterApply,
                        purchaseId: this.id,
                        modifyState,
                        files
                    })
                    .then(() => {
                        this.$Message.success("提交成功");
                        this.$router.go(-1);
                    });
            });
        },
        //撤销采购申请记录
        cancelPurchase() {
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
        //打回申请
        backPurchaseState() {
            this.$axios
                .post(`/purchase/backPurchaseState`, {
                    purchaseId: this.id,
                    content: this.modal.content
                })
                .then(() => {
                    this.$Message.success("打回申请成功");
                    this.$router.go(-1);
                });
            // kldConfirm({
            //     title: "提示",
            //     content: "是否确定打回申请？",
            //     maskClosable: false, //是否允许点击遮罩关闭 默认:false
            //     okText: "确定", //确认按钮文本  默认:确认
            //     cancelText: "返回", //确认取消文本  默认:取消
            //     ok: () => {

            //     }
            // });
        },
        postData() {
            kldConfirm({
                title: "提示",
                content: "确定提交吗",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "返回", //确认取消文本  默认:取消
                ok: () => {
                    if (
                        this.oldDetail.procurementState === 2 ||
                        this.oldDetail.procurementState === 7
                    ) {
                        this.SpecificationPost();
                    }
                    if (this.oldDetail.procurementState === 6) {
                        this.commitApprove();
                    }
                }
            });
        },
        saveData() {
            kldConfirm({
                title: "提示",
                content: "确定保存吗",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "返回", //确认取消文本  默认:取消
                ok: () => {
                    if (
                        this.oldDetail.procurementState === 2 ||
                        this.oldDetail.procurementState === 7
                    ) {
                        this.SpecificationSave();
                    }
                    if (this.oldDetail.procurementState === 6) {
                        this.approvePurchase();
                    }
                }
            });
        }
    },
    created() {}
};
</script>
<style lang="less" scoped>
/deep/.under-btn {
    display: flex;
    justify-content: flex-end;
    > button {
        margin: 0 6px;
    }
}
.reject-apply {
    > p {
        font-size: 16px;
        text-align: center;
        margin-bottom: 15px;
    }
}
</style>

