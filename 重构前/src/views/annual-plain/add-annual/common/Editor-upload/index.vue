<template>
    <div class="editor-upload">
        <div>
            <slot name="vote-opinion">
                <div class="upload-title">
                    院部表决意见：
                </div>
                <RadioGroup v-model="hospitalType">
                    <Radio :label="1">通过</Radio>
                    <Radio :label="2">未通过</Radio>
                </RadioGroup>
            </slot>
        </div>
        <div>
            <div class="upload-title">

            </div>
            <kld-file-upload v-bind="$attrs" v-model="fileData"></kld-file-upload>
        </div>
        <slot name="vote-remark">
            <div class="remark">
                <div class="upload-title">
                    院部表决备注：
                </div>
                <i-input v-model="hospitalVote" type="textarea" :rows="4" :disabled='!ViewLimit("annual:hospital")'></i-input>
            </div>
        </slot>
        <div>
            <slot name="vote-btn">
                <Button class="kld-btn" v-if='ViewLimit("annual:hospital")' @click="postData">提交</Button>
            </slot>
        </div>
    </div>
</template>
<script>
import upload from "@common/kld-file-upload";
import confirm from "@/common/kld-confirm";
export default {
    name: "editor-upload",
    props: {
        //文件
        value: {
            type: Array,
            default() {
                return [];
            }
        },
        data: {
            type: Object,
            default() {
                return {
                    hospitalType: 1, //投票
                    hospitalVote: "" //备注
                };
            }
        },
        uploadUrl: {
            default() {
                return {
                    ImgUrl: `photo/${this.$store.state.user_in.osId}/15/upload`,
                    FileUrl: `/fileUplod/${
                        this.$store.state.user_in.osId
                    }/uploadAnnualPlan/${this.$route.query.id}?type=1`
                };
            }
        }
    },
    data() {
        return {
            hospitalType: null,
            hospitalVote: ""
        };
    },
    components: {
        [upload.name]: upload
    },
    computed: {
        fileData: {
            set(v) {
                this.$emit("input", v);
            },
            get() {
                return this.value;
            }
        }
    },
    watch: {
        data: {
            handler(value) {
                this.hospitalType = value.hospitalType;
                this.hospitalVote = value.hospitalVote;
            },
            deep: true,
            immediate: true
        },
        hospitalType(value) {
            this.data.hospitalType = value;
        },
        hospitalVote(value) {
            this.data.hospitalVote = value;
        }
    },
    methods: {
        postData() {
            confirm({
                title: "提示",
                content: "是否提交",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "取消", //确认取消文本  默认:取消
                ok: () => {
                    this.UpFile();
                },
                cancel: () => {}
            });
        },
        UpFile(
            ImgUrl = this.uploadUrl.ImgUrl,
            FilUrl = this.uploadUrl.FileUrl
        ) {
            const mask = [],
                fileFormData = new FormData(),
                config = {
                    headers: {
                        "content-type": "multipart/form-data"
                    }
                };
            this.fileData.map(v => {
                if (
                    v.name.endsWith("png") ||
                    v.name.endsWith("jpg") ||
                    v.name.endsWith("jpeg")
                ) {
                    if (ImgUrl) {
                        const formData = new FormData();
                        formData.append("file", v);
                        mask.push(this.$axios.post(ImgUrl, formData, config));
                    }
                } else if (
                    v.name.endsWith("doc") ||
                    v.name.endsWith("docx") ||
                    v.name.endsWith("xls") ||
                    v.name.endsWith("xlsx")
                ) {
                    fileFormData.append("file", v);
                }
            });
            mask.push(this.$axios.post(FilUrl, fileFormData, config));
            Promise.all(mask).then(data => {
                let temp = data
                    .filter(v => {
                        if (v.data) {
                            return v.data;
                        }
                    })
                    .map(v => v.data);
                this.submit(temp);
            });
        },
        //数据提交接口
        submit(temp) {
            this.$axios
                .put(`/annualPlanTmp/updateHospitalDepartment`, {
                    id: this.$route.query.id,
                    hospitalType: this.hospitalType,
                    hospitalVote: this.hospitalVote,
                    hospitalPic: temp
                })
                .then(res => {
                    this.$Message.success("提交成功");
                    this.$router.go(-1);
                });
        }
    }
};
</script>
<style lang="less" scoped>
.editor-upload {
    margin-bottom: 15px;
    .remark {
        margin-bottom: 15px;
    }
    .upload-title {
        margin-bottom: 15px;
        font-size: 14px;
    }
}
</style>
