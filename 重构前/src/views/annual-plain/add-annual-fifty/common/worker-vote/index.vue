<template>
    <Form
            :model="formData"
            :rules="formRules"
            label-position="top"
            style="margin-top: 10px;padding: 20px;"
            ref="form"
    >
        <FormItem label="职工大会表决意见：" prop="workType">
            <RadioGroup v-model="formData.workType">
                <Radio :label="1" :disabled="! limit">通过</Radio>
                <Radio :label="2" :disabled="! limit">未通过</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="职工大会表决备注：" prop="workVote" style="margin-top: 40px;">
            <i-input v-model="formData.workVote" :disabled="! limit" type="textarea" :rows="4"></i-input>
        </FormItem>
        <FormItem v-if="limit" prop="workPic" label="职工大会表决附件：" style="margin-top: 20px;">
            <kld-up-file
                    :file-list="formData.workPic"
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
                    maxCount="infinity"
            ></kld-up-file>
        </FormItem>
    </Form>
</template>

<script>
    import KldUpFile from "@common/C-UploadFile/CUploadFile.vue";
    import confirm from '@common/kld-confirm';
    import testLimit from '@common/test-limit';

    export default {
        name: "worker-vote",
        components: {KldUpFile},
        data() {
            return {
                limit: testLimit('annual:work'),
                formRules: {
                    workType: {
                        required: true,
                        message: '请选择职工大会表决意见'
                    }
                },
                formData: {
                    id: this.$route.query.id,
                    workType: '',
                    workVote: '',
                    workPic: []
                },
                urlData: ''
            };
        },
        computed: {
            hospitalId() {
                return this.$store.state.user_in.osId;
            },
            plainId() {
                return this.$route.query.id;
            }
        },
        methods: {
            postData() {
                this.$refs['form'].validate(valid => {
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
                                const
                                    file = [],
                                    img = [];

                                for (const item of this.formData.workPic) {
                                    if (
                                        item.name.endsWith("doc") ||
                                        item.name.endsWith("docx") ||
                                        item.name.endsWith("wps") ||
                                        item.name.endsWith("xls") ||
                                        item.name.endsWith("xlsx")
                                    ) {
                                        file.push(item);
                                    } else {
                                        img.push(item);
                                    }
                                }
                                Promise.all([
                                    this.$axios.post(
                                        `/fileUplod/${this.hospitalId}/uploadAnnualPlan/${this.plainId}?type=2`,
                                        file.reduce((formData, file) => {
                                            formData.append('file', file);
                                            return formData;
                                        }, new FormData()),
                                        uploadConfig
                                    ),
                                    ...img.map(v => {
                                        const data = new FormData();
                                        data.append("file", v);
                                        return this.$axios.post(
                                            `photo/${this.hospitalId}/18/upload`,
                                            data,
                                            uploadConfig
                                        );
                                    })
                                ]).then(([noop, ...img]) => {
                                    let temp = img.map(v => typeof v.data === "object" && v.data);
                                    this.urlData = temp.filter(v => v !== false);
                                    this.submit();
                                });
                            }
                        });
                    }
                });
            },
            submit() {
                this.$axios
                    .put(`/annualPlanTmp/updateWorkVote`, {
                        ...this.formData,
                        workPic: this.urlData
                    })
                    .then(res => {
                        this.$Message.success("提交成功");
                        this.$router.go(-1);
                    });
            },
        }
    }
</script>

<style scoped lang="less">

</style>