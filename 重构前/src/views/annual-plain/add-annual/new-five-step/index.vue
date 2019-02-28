<template>
    <div>
        <div>
            <application-plan></application-plan>
        </div>
        <div>
            <committee :ListData='ListData'
                       :put='true'
                       :AllData='AllData'></committee>
        </div>
        <div class="pull-down">
            <pullDown>
                <div slot='title'>
                    院部讨论
                </div>
                <div style="padding:0 20px;padding-top:30px">
                    <file-list :data='hospitalData'></file-list>
                </div>
            </pullDown>
        </div>
        <div class="annual-fifty-step3">
            <Form ref='formRules'
                  :model="formData"
                  :rules="formRules"
                  label-position="top"
                  style="padding: 20px;">
                <FormItem label="单位专家表决意见："
                          prop="unitExpertsType">
                    <RadioGroup v-model="formData.unitExpertsType">
                        <Radio :label="1"
                               :disabled='!ViewLimit("annual:unit")'>通过</Radio>
                        <Radio :label="2"
                               :disabled='!ViewLimit("annual:unit")'>未通过</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="单位专家表决备注："
                          prop="unitExpertsVote"
                          style="margin-top: 20px;">
                    <i-input :disabled='!ViewLimit("annual:unit")'
                             v-model="formData.unitExpertsVote"
                             type="textarea"
                             :rows="4"></i-input>
                </FormItem>
                <FormItem v-if='ViewLimit("annual:unit")'
                          prop="unitPic"
                          label="单位专家表决附件："
                          style="margin-top: 20px;">
                    <kld-up-file :fileList="formData.unitPic"
                                 :accept='["png","jpeg","jpg"]'
                                 :second="{
                            show: false,
                            title: '附件',
                            icon: [
                                require('@common/C-UploadFile/image/pict.png')
                            ]
                        }"
                                 maxCount="infinity"></kld-up-file>
                </FormItem>
            </Form>
            <div class="post-btn">
                <Button class="kld-btn"
                        @click="GoBack">返回</Button>
                <Button @click="postData"
                        class="kld-btn"
                        v-if='ViewLimit("annual:unit")'>提交</Button>

            </div>
        </div>
    </div>

</template>

<script>
import KldUpFile from "@common/C-UploadFile/CUploadFile.vue";
import confirm from "@common/kld-confirm/index.js";
import ALPlan from "../common/application-plan/index";
import committee from "../common/committee";
import votes from "../../add-annual-fifty/common/finally-resolve";
import pullDown from "../../add-annual-fifty/common/kld-collapse/index.vue";
import fileList from "../detail-annual/common/file-list";
// import kldConfirm from '@common/kld-confirm'
export default {
    components: {
        KldUpFile,
        [ALPlan.name]: ALPlan,
        [committee.name]: committee,
        votes,
        pullDown,
        fileList
    },
    data() {
        return {
            methodsCount: null,
            loading: false,
            formRules: {
                unitExpertsType: {
                    required: true,
                    message: "请选择表决意见"
                }
            },
            formData: {
                id: this.$route.query.id,
                unitExpertsType: null,
                unitExpertsVote: "",
                unitPic: []
            },
            urlData: [],
            ListData: [],
            data: {},
            AllData: null
        };
    },
    created() {
        this.getData();
    },
    methods: {
        submit() {
            this.$axios
                .put(`/annualPlanTmp/updateUnit`, {
                    ...this.formData,
                    unitPic: this.urlData
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
                                ...this.formData.unitPic.map(v => {
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
                                            }/16/upload`,
                                            img,
                                            uploadConfig
                                        );
                                    }
                                })
                                // this.$axios.post(
                                //     `/fileUplod/${
                                //         this.$store.state.user_in.osId
                                //     }/uploadAnnualPlan/${
                                //         this.$route.query.id
                                //     }?type=1`,

                                //     file,
                                //     uploadConfig
                                // )
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
                        },
                        cancel: () => {}
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
    },
    computed: {
        hospitalData() {
            if (this.AllData) {
                let data = this.AllData;
                return {
                    radio: {
                        title: "院部讨论意见：",
                        content: data.hospitalType
                    },
                    file: {
                        title: "院部讨论附件：",
                        content: data.hospitalFiles
                    },
                    imgUrl: data.hospitalPhotos,
                    note: {
                        title: "院部讨论备注：",
                        content: data.hospitalVote
                    }
                };
            }
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
.pull-down {
    padding-top: 10px;
}
</style>


