<template>
    <div class="step4-wrap">
        <Form :model="formData" :rules="formRules" ref="form" label-position="top">
            <type :title="'关联性评价'"></type>
            <Row :gutter="20">
                <i-col :span="12">
                    <FormItem label="使用医疗器械与已发生/可能发生的伤害事件之间是否具有合理的先后时间顺序？" prop="timeSequence">
                        <Select v-model="formData.timeSequence" class="kld-select" placeholder="请选择">
                            <Option :value="1">是</Option>
                            <Option :value="2">否</Option>
                        </Select>
                    </FormItem>
                </i-col>
                <i-col :span="12">
                    <FormItem label="发生/可能发生的伤害事件是否属于所使用医疗器械可能导致的伤害类型？" prop="lesionType">
                        <Select v-model="formData.lesionType" class="kld-select" placeholder="请选择">
                            <Option :value="1">是</Option>
                            <Option :value="2">否</Option>
                            <Option :value="3">无法确定</Option>
                        </Select>
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="20">
                <i-col :span="12">
                    <FormItem label="已发生/可能发生的伤害事件是否可以用合并用药和/或械的作用、患者病情或其他非医疗器械因素来解释？" prop="deviceFactors">
                        <Select v-model="formData.deviceFactors" class="kld-select" placeholder="请选择">
                            <Option :value="1">是</Option>
                            <Option :value="2">否</Option>
                            <Option :value="3">无法确定</Option>
                        </Select>
                    </FormItem>
                </i-col>
                <i-col :span="12">
                    <FormItem label="关联性评价结果：" prop="evaluationResult">
                        <Select v-model="formData.evaluationResult" class="kld-select" placeholder="请选择">
                            <Option :value="1">很有可能</Option>
                            <Option :value="2">可能有关</Option>
                            <Option :value="3">可能无关</Option>
                            <Option :value="4">不能确定</Option>
                        </Select>
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="20">
                <i-col :span="12">
                    <FormItem label="报告人角色：" prop="reporter">
                        <Select v-model="formData.reporter" class="kld-select" placeholder="请选择">
                            <Option :value="1">医师</Option>
                            <Option :value="2">技师</Option>
                            <Option :value="3">护士</Option>
                            <Option :value="4">工程师</Option>
                            <Option :value="5">其他</Option>

                        </Select>
                    </FormItem>
                </i-col>
            </Row>
            <FormItem label="上传报告图片：">
                <kld-img-upload
                    v-model="formData.photos"
                    :max-size="5 * 1024 * 1024"
                    :accept="['image/jpeg', 'image/png', 'image/jpg']"
                    @error-file-type="$Message.warning('文件类型仅支持jpg, jpeg, png')"
                    @error-file-size="$Message.warning('文件大小必须在5MB以内')"
                    multiple
                ></kld-img-upload>
                <p style="font-size: 12px; color: #80848f;">文件类型仅支持jpg，jpeg，png，文件大小必须在5MB以内</p>
            </FormItem>
        </Form>
    </div>
</template>


<script>
    import type from './type'
    import kldImgUpload from '@common/kld-img-upload';
    export default {
        data() {
            return {
                formRules: {
                    timeSequence: {required: true, message: '此选项为必选'},
                    lesionType: {required: true, message: '此选项为必选'},
                    deviceFactors: {required: true, message: '此选项为必选'},
                    evaluationResult: {required: true, message: '此选项为必选'},
                    reporter: {required: true, message: '此选项为必选'},
                }
            }
        },
        props: {
            value: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        computed: {
            formData: {
                get() {
                    return this.value;
                },
                set(data) {
                    this.$emit('input', data);
                }
            }
        },
        methods: {
            validate(callback) {
                if (typeof callback === 'function') {
                    this.$refs.form.validate(callback);
                } else {
                    this.$refs.form.validate();
                }
            }
        },
        components: {
            type,
            kldImgUpload
        }
    };
</script>

<style lang="less" scoped>
    .step4-wrap {
        .kld-date-picker{
            width: 100%;
        }
        .ivu-form-item{
            margin-top: 6px;
            margin-bottom: 26px !important;
        }
        .input-half {
            display: flex;
            justify-content: space-between;
            flex-flow: row wrap;
            li {
                width: 49%;
                p {
                    white-space: nowrap;
                    font-size: 14px;
                    color: #000000;
                    margin: 15px 0 10px;
                    span {
                        display: inline-block;
                        max-width: 90%;
                    }
                }
            }
        }
        .attachment {
            margin-top: 20px;
            position: relative;
            p { 
                
                font-size: 14px;
                color: #000000;
                margin: 15px 0 10px;
                span {
                    color: #a9a8a9;
                }
            }
        }
    }
</style>
