<template>
    <Form :model="formData" :rules="formRules" label-position="top" style="margin-top: 10px;padding: 20px;" ref="form">
        <FormItem label="院部表决意见：" prop="hospitalType">
            <RadioGroup v-model="formData.hospitalType">
                <Radio :disabled="! limit" :label="1">通过</Radio>
                <Radio :disabled="! limit" :label="2">未通过</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="院部表决备注：" prop="hospitalVote" style="margin-top: 40px;">
            <i-input :disabled="! limit" v-model="formData.hospitalVote" type="textarea" :rows="4"></i-input>
        </FormItem>
        <FormItem v-if="limit" prop="hospitalPic" label="院部表决附件：" style="margin-top: 20px;">
            <kld-file-upload v-model="formData.hospitalPic" :accept="['.jpg', '.jpeg', '.png', '.xlsx', '.xls', '.doc', '.docx', '.wps']" :max-size="3 * 1024 * 1024" :downloadable="downloadable"></kld-file-upload>
        </FormItem>
    </Form>
</template>

<script>
import KldFileUpload from "@common/kld-file-upload";
import confirm from "@common/kld-confirm";
import testLimit from "@common/test-limit";
import noExpandMerge from "@common/no-expand-merge";

export default {
    name: "court-vote",
    components: { KldFileUpload },
    props: {
        data: {
            type: Object
        },
        isDetail: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            limit: testLimit("annual:hospital"),
            formData: {
                id: this.$route.query.id,
                hospitalType: "",
                hospitalVote: "",
                hospitalPic: []
            },
            formRules: {
                hospitalType: {
                    required: true,
                    message: "请选择院部讨论意见"
                }
            },
            downloadable: false,
            urlData: ""
        };
    },
    watch: {
        data: {
            immediate: true,
            handler(data) {
                if (data && data.hospitalType !== 0) {
                    this.downloadable = true;

                    noExpandMerge(this.formData, data);

                    let { hospitalFiles: files, hospitalPhotos: photos } = data;

                    files = files || [];
                    photos = photos || [];

                    Promise.all(
                        [
                            ...files.map(
                                ({ fileName: filename, fileUrl: url }) => ({
                                    filename,
                                    url
                                })
                            ),
                            ...photos.map(({ photoUrl: url }) => ({
                                url,
                                filename: url.match(/.+\/(.+?)$/)[1]
                            }))
                        ].map(({ url, filename }) =>
                            this.$axios
                                .get(url, { responseType: "blob" })
                                .then(({ data }) => new File([data], filename))
                        )
                    ).then(files => {
                        this.formData.hospitalPic = files;
                    });
                }
            }
        }
    },
    methods: {
        postData() {
            this.$refs["form"].validate(valid => {
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

                            const tasks = [],
                                fileFormData = new FormData();

                            for (const file of this.formData.hospitalPic) {
                                if (
                                    file.name.endsWith("doc") ||
                                    file.name.endsWith("docx") ||
                                    file.name.endsWith("wps") ||
                                    file.name.endsWith("xls") ||
                                    file.name.endsWith("xlsx")
                                ) {
                                    fileFormData.append("file", file);
                                } else {
                                    const imgFormData = new FormData();
                                    imgFormData.append("file", file);

                                    tasks.push(
                                        this.$axios.post(
                                            `photo/${
                                                this.$store.state.user_in.osId
                                            }/15/upload`,
                                            imgFormData,
                                            uploadConfig
                                        )
                                    );
                                }
                            }

                            tasks.push(
                                this.$axios.post(
                                    `/fileUplod/${
                                        this.$store.state.user_in.osId
                                    }/uploadAnnualPlan/${
                                        this.$route.query.id
                                    }?type=1`,
                                    fileFormData,
                                    uploadConfig
                                )
                            );


                                Promise.all(tasks)
                                    .then(res => {
                                        let temp = res.map(v => typeof v.data === "object" && v.data);
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
                .put(`/annualPlanTmp/updateHospitalDepartment`, {
                    ...this.formData,
                    hospitalPic: this.urlData
                })
                .then(res => {
                    this.$Message.success("提交成功");
                    this.$router.go(-1);
                });
        }
    }
};
</script>

<style scoped lang="less">
.ivu-form {
    /deep/.ivu-form-item-label {
        font-size: 14px;
    }
}
</style>