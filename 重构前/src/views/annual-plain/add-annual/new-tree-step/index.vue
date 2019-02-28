<template>
    <div>
        <div>
            <application-plan></application-plan>
        </div>
        <div>
            <committee :ListData='ListData'
                       :put='true'
                       :AllData='AllData'
                       class="test"></committee>
        </div>
        <div class="annual-fifty-step3">

            <Form ref='formRules'
                  :model="formData"
                  :rules="formRules"
                  label-position="top"
                  style="padding: 20px;">
                <FormItem label="院部表决意见："
                          prop="hospitalType">
                    <RadioGroup v-model="formData.hospitalType">
                        <Radio :label="1"
                               :disabled='!ViewLimit("annual:hospital")'>通过</Radio>
                        <Radio :label="2"
                               :disabled='!ViewLimit("annual:hospital")'>未通过</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="院部表决备注："
                          prop="hospitalVote"
                          style="margin-top: 20px;">
                    <i-input v-model="formData.hospitalVote"
                             type="textarea"
                             :rows="4"
                             :disabled='!ViewLimit("annual:hospital")'></i-input>
                </FormItem>
                <FormItem v-if='ViewLimit("annual:hospital")'
                          prop="hospitalPic"
                          label="院部表决附件："
                          style="margin-top: 20px;">
                    <kld-up-file :fileList="formData.hospitalPic"
                                 :accept='["doc", "docx","jpg","png","jpeg","wps","xls", "xlsx"]'
                                 :second="{
                            show: false,
                            title: '附件',
                            icon: [
                                require('@common/C-UploadFile/image/word.png'),
                                require('@common/C-UploadFile/image/excel.png'),
                                require('@common/C-UploadFile/image/pict.png')
                            ]
                        }"
                                 maxCount="infinity">
                    </kld-up-file>
                </FormItem>
            </Form>
            <div class="post-btn">
                <Button class="kld-btn"
                        @click="GoBack">返回</Button>
                <Button @click="postData"
                        class="kld-btn"
                        v-if='ViewLimit("annual:hospital")'>提交</Button>
            </div>
        </div>
    </div>

</template>

<script>
import votes from "../../add-annual-fifty/common/finally-resolve";
import KldUpFile from "@common/C-UploadFile/CUploadFile.vue";
import confirm from "@common/kld-confirm/index.js";
import ALPlan from "../common/application-plan/index";
import committee from "../common/committee";
// import kldConfirm from '@common/kld-confirm'
export default {
    components: {
        KldUpFile,
        [ALPlan.name]: ALPlan,
        [committee.name]: committee,
        votes
    },
    data() {
        return {
            methodsCount: null,
            loading: false,
            formRules: {
                hospitalType: {
                    required: true,
                    message: "请选择院部表决意见"
                }
            },
            formData: {
                id: this.$route.query.id,
                hospitalType: null,
                hospitalVote: "",
                hospitalPic: []
            },
            urlData: [],
            ListData: [],
            AllData: null
        };
    },
    created() {
        this.getData();
    },
    methods: {
        submit() {
            this.$axios
                .put(`/annualPlanTmp/updateHospitalDepartment`, {
                    ...this.formData,
                    hospitalPic: this.urlData
                })
                .then(res => {
                    this.$Message.success("提交成功");
                    this.$router.go(-1);
                });
        },
        postData() {
            this.$refs["formRules"].validate(valid => {
                if (valid) {
                    confirm({
                        title: "提示",
                        content: "是否确定提交",
                        maskClosable: false, //是否允许点击遮罩关闭 默认:false
                        okText: "确定", //确认按钮文本  默认:确认
                        cancelText: "取消", //确认取消文本  默认:取消
                        ok: () => {
                            const uploadConfig = {
                                headers: {
                                    "content-type": "multipart/form-data"
                                }
                            };
                            const file = new FormData();
                            Promise.all([
                                ...this.formData.hospitalPic.map(v => {
                                    if (
                                        v.name.endsWith("doc") ||
                                        v.name.endsWith("docx") ||
                                        v.name.endsWith("wps") ||
                                        v.name.endsWith("xls") ||
                                        v.name.endsWith("xlsx")
                                    ) {
                                        file.append("file", v);
                                    } else {
                                        const img = new FormData();
                                        img.append("file", v);
                                        return this.$axios.post(
                                            `photo/${
                                                this.$store.state.user_in.osId
                                            }/15/upload`,
                                            img,
                                            uploadConfig
                                        );
                                    }
                                }),
                                this.$axios.post(
                                    `/fileUplod/${
                                        this.$store.state.user_in.osId
                                    }/uploadAnnualPlan/${
                                        this.$route.query.id
                                    }?type=1`,
                                    file,
                                    uploadConfig
                                )
                            ]).then(res => {
                                let temp = res.map(
                                    v =>
                                        v &&
                                        typeof v.data === "object" &&
                                        v.data
                                );
                                this.urlData = temp.filter(v => v);
                                this.submit();
                            });
                        }
                    });
                }
            });
        },
        //获取详情
        getData() {
            this.$axios
                .get(`/annualPlanTmp/${this.$route.query.id}?type=${1}`)
                .then(({ data }) => {
                    this.data = data;
                    this.AllData = data;
                    this.ListData = data.annualPlanVote;
                });
        },
        GoBack() {
            confirm({
                title: "提示",
                content: "是否确定返回",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "取消", //确认取消文本  默认:取消
                ok: () => {
                    this.$router.go(-1);
                },
                cancel: () => {}
            });
        }
    }
};
</script>
<style lang="less" scoped>
.annual-fifty-step3 {
    width: 100%;
    .statistical-voting-result {
        padding: 10px 30px;
        display: flex;
        align-items: center;
        .voting-result-title {
            font-size: 16px;
            color: #f2740c;
            margin-right: 20px;
        }
    }
}
.annual-fifty-step3-modal {
    /deep/.annual-fifty-step3-modal-content {
        .vote-result {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            .vote-result-title {
                font-size: 16px;
                color: #000000;
            }
            .vote-result-content {
                font-size: 16px;
                color: #fe881a;
            }
        }
        .vote-result-query {
            font-size: 14px;
            color: #666666;
        }
    }
}
.post-btn {
    position: absolute;
    bottom: -62px;
    right: 30px;
    z-index: 1;
}
/deep/.annual-fifty-step3 {
    .ivu-form-label-top .ivu-form-item-label {
        font-size: 14px;
    }
    .ivu-radio-wrapper {
        font-size: 14px;
    }
}
</style>


