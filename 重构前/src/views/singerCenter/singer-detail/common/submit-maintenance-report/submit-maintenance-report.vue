<template>
    <i-button class="kld-btn"
              @click="show=true">
        <template>
            提交维修报告
        </template>

        <Modal v-model="show"
               title="维修报告"
               width="1000px"
               :styles="{top:'20px'}"
               :mask-closable='false'
               class-name="submit-maintenance-report-modal">
            <i-form ref="submission-form"
                    :model="submissionForm"
                    :rules="submissionValidate"
                    class="submit-maintenance-report-form">
                <div class='maintenance-report-item'>
                    <kld-type title="维修基础信息"></kld-type>
                    <form-item label="故障类型"
                               prop="fault">
                        <dropdown-dictionary type="faultType"
                                             placeholder="请填写故障类型"
                                             :id.sync='submissionForm.faultId'
                                             :content.sync='submissionForm.fault'></dropdown-dictionary>
                    </form-item>
                    <form-item label="故障现象"
                               prop="physicalFault">
                        <dropdown-dictionary type="faultPhenomenon"
                                             placeholder="请填写故障现象"
                                             :id.sync='submissionForm.physicalFaultId'
                                             :content.sync='submissionForm.physicalFault'></dropdown-dictionary>
                    </form-item>
                    <form-item label="处理方案"
                               prop='processScheme'>
                        <dropdown-dictionary type="faultProcess"
                                             placeholder="请填写处理方案"
                                             :id.sync='submissionForm.processSchemeId'
                                             :content.sync='submissionForm.processScheme'></dropdown-dictionary>
                    </form-item>
                    <form-item label="零配件信息"
                               prop='parts'>
                        <div style="dispaly:table;width:100%;">

                            <parts-table :list.sync='submissionForm.parts'></parts-table>
                        </div>
                    </form-item>

                </div>
                <div class='maintenance-report-item'>
                    <kld-type title="发票登记"></kld-type>
                    <form-item label="发票照片"
                               prop='photos'>
                        <c-upload :fileList='submissionForm.photos'
                                  class="upload-invoice-img"></c-upload>
                    </form-item>

                </div>
                <div class='maintenance-report-item'>
                    <kld-type title="备注信息"></kld-type>
                    <p style="margin:20px 0 10px;">维修总价
                        <span style="color:#a9a8a9;">（为保证设备折旧价值的计算，请填写本次维修总价，不做公开展示）</span>
                    </p>
                    <FormItem prop="maintenancePrice">
                        <InputNumber :min='0'
                                     :max='100000000'
                                     style="width:100%;"
                                     v-model="submissionForm.maintenancePrice"
                                     :formatter="moneyFormatter"
                                     :parser="moneyParse"></InputNumber>

                    </FormItem>
                    <FormItem label="备注信息"
                              prop="memo">
                        <Input type="textarea"
                               :maxlength='200'
                               :autosize='{ minRows: 4, maxRows: 6 }'
                               placeholder="请填写备注信息"
                               v-model="submissionForm.memo" />
                    </FormItem>

                </div>

            </i-form>
            <div slot="footer">
                <Button class="kld-btn-default"
                        @click="show=false">取消</Button>
                <Button class="kld-btn"
                        @click="checkSubmission"
                        :loading="btnLoading"
                        style="width:auto;">提交维修报告</Button>
            </div>

        </Modal>
    </i-button>
</template>
<script>
import dropdownDictionary from "./dropdown-dictionary.vue";
import { uploadImg } from "@common/C-Upload/uploadImgAPI.js";
import cUpload from "@common/C-Upload/C-upload";
import partsTable from "./parts-table.vue";
import kldType from "@common/kld-type";
export default {
    name: "submit-maintenance-report",
    components: {
        dropdownDictionary,
        kldType,
        partsTable,
        cUpload
    },
    data() {
        return {
            show: false,
            btnLoading: false,
            submissionForm: {
                fault: "", //故障类型
                faultId: "", //故障类型ID
                physicalFault: "", //故障现象
                physicalFaultId: "", //故障现象ID
                processScheme: "", //处理方案
                processSchemeId: "", //处理方案ID
                parts: [
                    {
                        partsName: "",
                        supplierId: "",
                        partsMoney: 0,
                        partsNum: 1
                    }
                ], //配件
                photos: [], //图片
                maintenancePrice: 0, //维修总价
                memo: "" //备注信息
            },
            submissionValidate: {
                fault: { required: true, message: "该项为必填项！" },
                physicalFault: { required: true, message: "该项为必填项！" },
                processScheme: { required: true, message: "该项为必填项！" }
            }
        };
    },
    props: {
        singerInfo: Object
    },
    computed: {
        singerId() {
            return this.$route.query.id;
        },
        userInfo() {
            return this.$store.state.user_in;
        },
        taskId() {
            return this.singerInfo.taskId;
        }
    },
    methods: {
        moneyFormatter(value) {
            // debugger;
            return `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        moneyParse(value) {
            let newValue=value.replace(/￥\s?|(,*)/g, "");
            return (+(+newValue.replace(/[^\d.]/g,"")).toFixed(2))+'';
        },
        checkSubmission() {
            this.$refs["submission-form"].validate(valid => {
                if (!valid) {
                    return this.$Message.warning(
                        "请 修改错误/填写必要 信息后提交！"
                    );
                }
                let list = this.submissionForm.parts;
                if (
                    list.length > 1 &&
                    !list.every(v => v.partsName && v.supplierId && v.partsNum)
                ) {
                    return this.$Message.warning(
                        "请 填写完整 或 移除 不完整零配件信息后再提交！"
                    );
                }
                this.submission();
            });
        },
        async submission() {
            this.btnLoading = true;

            try {
                const data = await uploadImg.call(
                    this,
                    this.submissionForm.photos,
                    21
                );
                let photos = data.map(file => file.data);

                let requestBody = {
                    parts: this.submissionForm.parts
                        .filter(v => v.partsName && v.supplierId)
                        .map(v => ({
                            partsName: v.partsName,
                            supplierId: v.supplierId,
                            partsMoney: v.partsMoney ? +v.partsMoney : 0,
                            partsNum: +v.partsNum
                        })),
                    fault: this.submissionForm.faultId //判断是否是自定义内容
                        ? null
                        : this.submissionForm.fault,
                    physicalFault: this.submissionForm.physicalFaultId
                        ? null
                        : this.submissionForm.physicalFault,
                    processScheme: this.submissionForm.processSchemeId
                        ? null
                        : this.submissionForm.processScheme,
                    faultId: this.submissionForm.faultId || null,
                    physicalFaultId:
                        this.submissionForm.physicalFaultId || null,
                    processSchemeId:
                        this.submissionForm.processSchemeId || null,
                    maintenancePrice: this.submissionForm.maintenancePrice,
                    memo: this.submissionForm.memo || null,

                    reportId: this.singerId,

                    creatorId: this.singerInfo.creatorId,
                    photos
                };
                await this.$axios.post("/maintenanceReports", requestBody);
                // let activitiBody = {
                //     action: "YES",
                //     userIds: this.singerInfo.doctorNames
                // };
                // await this.$axios.post(
                //     `/activiti/complete/${this.taskId}/${this.singerId}`,
                //     activitiBody
                // );
                this.$Message.success("维修报告提交成功！");
                this.$router.go(-1);
            } finally {
                this.btnLoading = false;
            }
        }
    }
};
</script>

<style lang="less" scoped>
/deep/.submit-maintenance-report-modal {
    width: 100%;
    .submit-maintenance-report-form {
        width: 100%;
        .ivu-form-item {
            margin-bottom: 20px !important;
        }
        .maintenance-report-item {
            width: 100%;
        }
    }
}
</style>


