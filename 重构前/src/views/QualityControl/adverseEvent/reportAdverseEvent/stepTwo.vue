<template>
    <div class="step2-wrap">
        <Form :model="formData" :rules="formRules" ref="form" label-position="top">
            <type title="不良事件情况"></type>
            <Row :gutter="20">
                <i-col :span="12">
                    <FormItem label="事件主要表现-器械故障：" prop="aeMechanicalFailure">
                        <i-input v-model="formData.aeMechanicalFailure" placeholder="请填写器械故障" class="kld-input"></i-input>
                    </FormItem>
                </i-col>
                <i-col :span="12">
                    <FormItem label="事件主要表现-主要伤害：" prop="aePrimaryLesion">
                        <i-input v-model="formData.aePrimaryLesion" placeholder="请填写主要伤害" class="kld-input"></i-input>
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="20">
                <i-col :span="12">
                    <FormItem label="事件发生日期：">
                        <DatePicker :editable="false" @on-change="formData.aeOccurrenceDate = $event" :value="formData.aeOccurrenceDate" placeholder="请选择日期" class="kld-date-picker"></DatePicker>
                    </FormItem>
                </i-col>
                <i-col :span="12">
                    <FormItem label="发现或者知悉时间：">
                        <DatePicker :editable="false" :value="formData.aeDiscoveryDate" @on-change="formData.aeDiscoveryDate = $event" placeholder="请选择时间" class="kld-date-picker"></DatePicker>
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="20">
                <i-col :span="12">
                    <FormItem label="医疗器械实际使用场所：">
                        <Select v-model="formData.aeUsePlace" placeholder="请选择医疗器械实际使用场所" class="kld-select">
                            <Option :value="1">医疗机构</Option>
                            <Option :value="2">家庭</Option>
                            <Option :value="3">其他</Option>
                        </Select>
                    </FormItem>
                </i-col>
                <i-col :span="12">
                    <FormItem label="其他使用场所说明："> <!--prop="userPlaceMemo"-->
                        <i-input :disabled="formData.aeUsePlace !== 3" v-model="formData.userPlaceMemo" placeholder="请填写说明" class="kld-input"></i-input>
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="20">
                <i-col :span="12">
                    <FormItem label="事件后果：" prop="aeConseQuence">
                        <Select v-model="formData.aeConseQuence" placeholder="请选择事件后果" class="kld-select">
                            <Option :value="1">死亡</Option>
                            <Option :value="2">危及生命</Option>
                            <Option :value="3">机体功能结构永久性损伤</Option>
                            <Option :value="4">可能导致机体功能机构永久性损伤</Option>
                            <Option :value="5">需要内、外科治疗避免上述永久损伤</Option>
                            <Option :value="6">其他</Option>
                        </Select>
                    </FormItem>
                </i-col>
                <i-col :span="12">
                    <FormItem label="死亡时间：" prop="deathDate">
                        <DatePicker :editable="false" :disabled="formData.aeConseQuence !== 1" @on-change="formData.deathDate = $event" :value="formData.deathDate" placeholder="如出现死亡请选择" class="kld-date-picker"></DatePicker>
                    </FormItem>
                </i-col>
            </Row>
            <div class="row attachment">
                <FormItem label="事件陈述 ：" prop="aeState">
                    <Input v-model="formData.aeState" type="textarea" placeholder="请填写事件称述（此处输入信息将以附件的形式打印）" :rows="6" :autosize="false" :maxlength="1000" />
                    <p><span>(至少包括器械使用时间、使用目的、使用依据、使用情况、出现的不良事件情况、对受害者影响、采取的治疗措施、器械联合使用情况)</span></p>
                    <span class="text-count">{{formData.aeState ? formData.aeState.length : 0}}/1000</span>
                </FormItem>
            </div>
        </Form>
    </div>
</template>

<script>
    import type from './type'

    export default {
    data() {
        return {
            formRules: {
                aeMechanicalFailure: {required: true, message: '事件主要表现-器械故障为必填'},
                aePrimaryLesion: {required: true, message: '事件主要表现-主要伤害为必填'},
                aeConseQuence: {required: true, message: '事件后果为必选'},
                aeState: {required: true, message: '时间陈述为必填'},
                // userPlaceMemo: {validator: (rule, value, callback) => {
                //     if (this.formData.aeUsePlace === 3 && value === '') {
                //         callback(new Error('如果医疗器械实际使用场所选择为其他，其他使用场所说明为必填'));
                //     } else {
                //         callback();
                //     }
                // }},
                deathDate: {validator: (rule, value, callback) => {
                    if (this.formData.aeConseQuence === 1 && value === '') {
                        callback(new Error('如果事件后果选择为死亡，死亡时间为必选'));
                    } else {
                        callback();
                    }
                }},
            }
        };
    },
    props:{
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
    watch: {
        //监听医疗器械实际使用场所
        'formData.aeUsePlace'(value) {
            if (value !== 3) {
                this.formData.userPlaceMemo = '';
            }
        },
        //监听事件后果
        'formData.aeConseQuence'(value) {
            if (value !== 1) {
                this.formData.deathDate = '';
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
    components:{
        type
    }
}
</script>

<style lang="less" scoped>
.step2-wrap{
    .kld-date-picker{
        width: 100%;
    }
    .ivu-form-item{
        margin-top: 6px;
        margin-bottom: 26px !important;
    }
    .input-half{
        display: flex;
        justify-content: space-between;
        flex-flow: row wrap;
        li{
            width:49%;
            p{
                font-size: 14px;
                color: #000000; 
                margin:15px 0 10px;
            }
        }
    }
    .attachment{
        margin-top:20px;
        position: relative;
        p{
            font-size: 14px;
            color: #000000; 
            margin:15px 0 10px;
            span{
                color:#a9a8a9;
            }
        }
        
        .text-count{
            position: absolute;
            bottom: 6px;
            right: 17px;
            font-size: 14px;
            color: #a9a8a9;
        }
    }
}

</style>
