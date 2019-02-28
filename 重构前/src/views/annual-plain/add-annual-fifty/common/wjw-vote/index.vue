<template>
    <div>
        <file-list v-if="isUnitDetails" :data="expertDetailData" class="p-20"></file-list>
        <Form v-else ref="expert-form" :model="expertData" :rules="expertRules" label-position="top" class="p-20">
            <FormItem label="单位专家表决意见：" prop="unitExpertsType">
                <RadioGroup v-model="expertData.unitExpertsType">
                    <Radio :disabled="! expertLimit" :label="1">通过</Radio>
                    <Radio :disabled="! expertLimit" :label="2">未通过</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="单位专家表决备注：" prop="unitExpertsVote" style="margin-top: 40px;">
                <i-input :disabled="! expertLimit" v-model="expertData.unitExpertsVote" type="textarea" :rows="4"></i-input>
            </FormItem>
            <FormItem v-if="expertLimit" prop="unitPic" label="单位专家表决附件：" style="margin-top: 20px;">
                <kld-up-file :fileList="expertData.unitPic" :accept='["png","jpeg", "jpg"]' :second="{
                            show: false,
                            title: '图片',
                            icon: [
                                require('@common/C-UploadFile/image/pict.png')
                            ]
                        }" maxCount="infinity"></kld-up-file>
            </FormItem>
        </Form>
        <template v-if="isUnitResolve">
            <file-list v-if="isWjwDetails" :data="wjwDetailData" class="p-20"></file-list>

            <Form v-else ref="wjw-form" :model="wjwData" :rules="wjwRules" label-position="top" class="p-20">
                <FormItem label="卫计委专家表决意见：" prop="planningExpertsType">
                    <RadioGroup v-model="wjwData.planningExpertsType">
                        <Radio :label="1" :disabled="! wjwLimit">通过</Radio>
                        <Radio :label="2" :disabled="! wjwLimit">未通过</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="卫计委专家表决备注：" prop="planningExpertsVote" style="margin-top: 40px;">
                    <i-input v-model="wjwData.planningExpertsVote" :disabled="! wjwLimit" type="textarea" :rows="4"></i-input>
                </FormItem>
                <FormItem v-if="wjwLimit" prop="planningPic" label="卫计委专家表决附件：" style="margin-top: 20px;">
                    <kld-up-file :fileList="wjwData.planningPic" :accept='["png","jpeg", "jpg"]' :second="{
                            show: false,
                            title: '图片',
                            icon: [
                                require('@common/C-UploadFile/image/pict.png')
                            ]
                        }" maxCount="infinity"></kld-up-file>
                </FormItem>
            </Form>
        </template>
    </div>
</template>

<script>
    import KldUpFile from "@common/C-UploadFile/CUploadFile.vue";
    import testLimit from '@common/test-limit';
    import FileList from "../../../add-annual/detail-annual/common/file-list";
    import kldConfirm from '@common/kld-confirm';

    export default {
        name: "wjw-vote",
        components: {FileList, KldUpFile},
        props: {
            data: {type: Object},
            padding: {
                type: Boolean,
                default: true
            },
        },
        data() {
            const id = this.$route.query.id;
            return {
                expertLimit: testLimit('annual:unit'),
                wjwLimit: testLimit('annual:planning'),
                expertData: {
                    id,
                    unitExpertsType: '',
                    unitExpertsVote: "",
                    unitPic: []
                },
                expertRules: {
                    unitExpertsType: {
                        required: true,
                        message: '请选择单位专家表决意见'
                    }
                },
                wjwData: {
                    id,
                    planningExpertsType: '',
                    planningExpertsVote: "",
                    planningPic: [],

                    planType: this.$route.query.type
                },
                wjwRules: {
                    planningExpertsType: {
                        required: true,
                        message: '请选择卫计委专家表决意见'
                    }
                },
                urlData: ''
            };
        },
        computed: {
            atWjw() {
                return this.data && this.data.unitExpertsType === 1;
            },

            isWjwDetails() {
                const {data} = this;
                return data ? data.planningExpertsType !== 0 : false
            },

            isUnitDetails() {
                const {data} = this;

                return Boolean(data && data.unitExpertsType !== 0);
            },

            isUnitResolve() {
                const {data} = this;

                return Boolean(data && data.unitExpertsType === 1);
            },

            formData() {
                return this.atWjw ? this.wjwData : this.expertData;
            },

            expertDetailData() {
                if (this.data) {
                    const {unitExpertsType: radio, unitExpertsVote: note, unitExpertsPhotos: photos} = this.data;
                    return {
                        radio: {
                            title: '单位专家表决意见',
                            content: radio
                        },
                        note: {
                            title: '单位专家表决备注',
                            content: note
                        },
                        file: {
                            title: '单位专家表决附件',
                            content: []
                        },
                        imgUrl: photos
                    }
                }
            },
            wjwDetailData() {
                if (this.data) {
                    const {planningExpertsType: radio, planningExpertsVote: note, planningExpertsPhotos: photos} = this.data;
                    return {
                        radio: {
                            title: '卫计委专家表决意见',
                            content: radio
                        },
                        note: {
                            title: '卫计委专家表决备注',
                            content: note
                        },
                        file: {
                            title: '卫计委专家表决附件',
                            content: []
                        },
                        imgUrl: photos
                    }
                }
            },
        },
        methods: {
            submit() {

                this.$axios
                    .put(`/annualPlanTmp/${this.atWjw ? 'updateNHFPC' : 'updateUnit'}`, {
                        ...this.formData,
                        [this.atWjw ? 'planningPic' : 'unitPic']: this.urlData
                    })
                    .then(() => {
                        this.$Message.success("提交成功");
                        this.$router.go(-1);
                    });

            },
            postData() {
                this.$refs[this.atWjw ? 'wjw-form' : 'expert-form'].validate(valid => {
                    if (valid) {
                        kldConfirm({
                            title: '确认提交审批',
                            content: '是否确认提交审批？',
                            maskClosable: false,  //是否允许点击遮罩关闭 默认:false
                            ok:()=> {
                                //当点击了确认按钮时
                                const uploadConfig = {
                                    headers: {
                                        "content-type": "multipart/form-data"
                                    }
                                };
                                Promise.all(
                                    this.formData[this.atWjw ? 'planningPic' : 'unitPic'].map(v => {
                                        const img = new FormData();
                                        img.append("file", v);
                                        return this.$axios.post(
                                            `photo/${this.$store.state.user_in.osId}/${this.atWjw ? 17 : 16}/upload`,
                                            img,
                                            uploadConfig
                                        );
                                    })
                                ).then(res => {
                                    let temp = res.map(v => typeof v.data === "object" && v.data);
                                    this.urlData = temp.filter(v => v !== false);
                                    this.submit();
                                });
                            }
                        });
                    }
                });
            }
        }
    }
</script>

<style scoped lang="less">
    .ivu-form{
        /deep/.ivu-form-item-label{
            font-size: 14px;
        }
    }
</style>