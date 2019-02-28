<template>
    <div class="step1-wrap">
        <Form label-position="top" ref="form" :model="formData" :rules="formRules">
            <type title="基础信息"></type>
            <Row :gutter="20">
                <i-col :span="12">
                    <FormItem label="报告日期：" prop="aeReportDate">
                        <DatePicker :editable="false" @on-change="formData.aeReportDate = $event" :value="formData.aeReportDate" class="kld-date-picker" type="date" placeholder="请选择报告日期"></DatePicker>
                    </FormItem>
                </i-col>
                <i-col :span="12">
                    <FormItem label="报告人：">
                        <poptip-show-info :info-id="$store.state.user_in.id" width="100%">
                            <Input class="kld-input" disabled :value="$store.state.user_in.name" />
                        </poptip-show-info>
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="20">
                <i-col :span="12">
                    <FormItem label="报告编码：" prop="aeCode">
                        <Input v-model="formData.aeCode" :maxlength="20" class="kld-input" placeholder="请填写报告编码" />
                    </FormItem>
                </i-col>
                <i-col :span="12">
                    <FormItem label="报告来源：" prop="aeReportSource">
                        <Select v-model="formData.aeReportSource" class="kld-select" placeholder="请选择报告来源">
                            <Option :value="1">生产企业</Option>
                            <Option :value="2">经营企业</Option>
                            <Option :value="3">使用单位</Option>
                        </Select>
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="20">
                <i-col :span="12">
                    <FormItem label="单位名称：" prop="unitName">
                        <Input v-model="formData.unitName" class="kld-input" type="text" placeholder="请填写单位名称" />
                    </FormItem>
                </i-col>
                <i-col :span="12">
                    <FormItem label="联系电话：" prop="unitPhone">
                        <Input v-model="formData.unitPhone" class="kld-input" type="text" placeholder="请填写联系电话" />
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="20">
                <i-col :span="12">
                    <FormItem label="联系地址：" prop="unitAddress">
                        <Input v-model="formData.unitAddress" class="kld-input" type="text" placeholder="请填写联系地址" />
                    </FormItem>
                </i-col>
                <i-col :span="12">
                    <FormItem label="邮编：" prop="unitZipCode">
                        <kld-input-number v-model="formData.unitZipCode" placeholder="请填写邮编" maxlength="6"></kld-input-number>
                        <!--<Input v-model="formData.unitZipCode" class="kld-input"  placeholder="请填写邮编" />-->
                    </FormItem>
                </i-col>
            </Row>
            <type title="患者资料"></type>
            <Row :gutter="20">
                <i-col :span="8">
                    <FormItem label="患者姓名：">
                        <Input v-model="formData.patientName" class="kld-input" type="text" placeholder="请填写患者姓名" />
                    </FormItem>
                </i-col>
                <i-col :span="8">
                    <FormItem label="年龄：">
                        <Input v-model="formData.patientAge" class="kld-input" type="text" placeholder="请填写患者年龄" />
                    </FormItem>
                </i-col>
                <i-col :span="8">
                    <FormItem label="联系方式：">
                        <kld-input-number v-model="formData.patientPhone" placeholder="请填写患者的电话"></kld-input-number>
                        <!--<Input v-model="formData.patientPhone" class="kld-input" type="text" placeholder="请填写患者的电话" />-->
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="20">
                <i-col :span="8">
                    <FormItem label="患者出生日期：">
                        <DatePicker :editable="false" @on-change="formData.patientBirthday = $event" :value="formData.patientBirthday" class="kld-date-picker" type="date" placeholder="请选择出生日期"></DatePicker>
                    </FormItem>
                </i-col>
                <i-col :span="8">
                    <FormItem label="患者性别：" >
                        <Select v-model="formData.patientSex" class="kld-select" placeholder="请选择性别">
                            <Option :value="1">男</Option>
                            <Option :value="2">女</Option>
                        </Select>
                    </FormItem>
                </i-col>
            </Row>
            <div class="row attachment">
                <FormItem label="预期治疗疾病或作用 ：">
                    <Input v-model="formData.desiredResult" type="textarea" placeholder="请填写与其治疗疾病或作用（此处输入信息将以附件的形式打印）" :rows="6" :autosize="false" :maxlength="1000" />
                </FormItem>
                <span class="text-count">{{formData.desiredResult ? formData.desiredResult.length : 0}}/1000</span>
            </div>
        </Form>
    </div>
</template>


<script>
import type from "./type";
import poptipShowInfo from '@common/poptip-show-info';
import kldInputNumber from '@common/kld-input-number';
export default {
    data() {
        const validatorPhone = (rule, value, callback) => {
            if (value == "") {
                callback(new Error("电话为必填项"));
            } else if (!/^[0-9]*$/.test(value)) {
                callback(new Error("请输入正确的电话"));
            }
            callback();
        };
        const validatorAge = (rule, value, callback) => {
            if (!/^[0-9]*$/.test(value)) {
                callback(new Error("请输入正确的年龄"));
            }
            callback();
        };
        const validatorPatient = (rule, value, callback) => {
            if (!/^[0-9]*$/.test(value)) {
                callback(new Error("请输入正确的联系方式"));
            }
            callback();
        };
        return {
            formRules: {
                aeReportDate: { required: true, message: "报告日期为必选" },
                aeCode: { required: true, message: "报告编码为必填" },
                aeReportSource: { required: true, message: "报告来源为必选" },
                unitName: { required: true, message: "单位名称为必填" },
                unitAddress: { required: true, message: "联系地址为必填" },
                unitZipCode: [
                    { required: true, message: '邮编为必填项'},
                    {len: 6, message: '邮编必须为6位', trigger: 'blur'}
                ],
                unitPhone: { validator: validatorPhone, required: true },
                patientAge: { validator: validatorAge },
                patientPhone: { validator: validatorPatient }
            }
        };
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
                this.$emit("input", data);
            }
        }
    },
    methods: {
        validate(callback) {
            if (typeof callback === "function") {
                this.$refs.form.validate(callback);
            } else {
                this.$refs.form.validate();
            }
        }
    },
    components: {
        type,
        poptipShowInfo,
        kldInputNumber
    }
};
</script>

<style lang="less" scoped>
.step1-wrap {
    .kld-date-picker {
        width: 100%;
    }
    .ivu-form-item {
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
                font-size: 14px;
                color: #000000;
                margin: 15px 0 10px;
            }
        }
    }
    .patient-info {
        display: flex;
        justify-content: space-between;
        li {
            width: 32%;
            p {
                font-size: 14px;
                color: #000000;
                margin: 15px 0 10px;
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
        .text-count {
            position: absolute;
            bottom: 6px;
            right: 17px;
            font-size: 14px;
            color: #a9a8a9;
        }
    }
}
</style>
