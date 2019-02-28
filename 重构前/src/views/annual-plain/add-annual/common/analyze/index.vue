<template>
    <div>
        <kld-type title='经济效益分析' class="step-type"></kld-type>
        <div class="analyze-list">
            <Form ref="formValidate" :model="selectData" :rules="ruleSelect">
                <Row style="margin-bottom: 12px;" :gutter="20">
                    <i-col span="8">
                        <div class="list-title">
                            资金来源：
                            <span class='requiredX'>*</span>
                        </div>
                        <FormItem prop="capitalSource">
                            <i-select placeholder="请选择资金来源" class="kld-select" :disabled="detail" v-model="selectData.capitalSource">
                                <i-option v-for="(item,i) in source" :value='i+1' :key='i+new Date()'>{{item}}</i-option>
                            </i-select>
                        </FormItem>
                    </i-col>
                    <i-col span="8">
                        <div class="list-title">
                            使用年限：
                            <span class='requiredX'>*</span>
                        </div>
                        <FormItem prop="durableYears">
                            <i-select placeholder="请选择使用年限" class="kld-select" :disabled="detail" v-model="selectData.durableYears">
                                <i-option v-for="(item,i) in year" :value='item' :key='i+new Date()'>{{item}}</i-option>
                            </i-select>
                        </FormItem>
                    </i-col>
                    <i-col span="8">
                        <div class="list-title">
                            收费标准：
                            <span class='requiredX'>*</span>
                        </div>
                        <FormItem prop="rates">
                            <Input :disabled="detail" class="kld-input" placeholder="请输入收费标准" v-model="selectData.rates"></Input>
                            <!-- <kld-input-number :min='0' class="kld-input" placeholder="请输入收费标准" :disabled="detail" v-model="selectData.rates">
                                <span slot="append">万元</span>
                            </kld-input-number> -->
                        </FormItem>
                    </i-col>
                </Row>
                <Row style="margin-bottom: 12px;" :gutter="20">
                    <i-col span="8">
                        <div class="list-title">
                            预计年经济收入：
                            <span class='requiredX'>*</span>
                        </div>
                        <FormItem prop="expectIncome">
                            <Input class="kld-input" placeholder="请输入预计年经济收入" :disabled="detail" v-model="selectData.expectIncome"></Input>
                            <!-- <kld-input-number :min='0' class="kld-input" placeholder="请输入预计年经济收入" :disabled="detail" v-model="selectData.expectIncome">
                                <span slot="append">万元</span>
                            </kld-input-number> -->
                        </FormItem>
                    </i-col>
                    <i-col span="8">
                        <div class="list-title">
                            年折旧费用：
                            <span class='requiredX'>*</span>
                        </div>
                        <FormItem prop="depreciationCost">
                            <Input class="kld-input" placeholder="请输入年折旧费用" :disabled="detail" v-model="selectData.depreciationCost"></Input>

                            <!-- <kld-input-number :min='0' class="kld-input" placeholder="请输入年折旧费用" :disabled="detail" v-model="selectData.depreciationCost">
                                <span slot="append">万元</span>
                            </kld-input-number> -->
                        </FormItem>
                    </i-col>
                    <i-col span="8">
                        <div class="list-title">
                            科室直接人员费用：
                            <span class='requiredX'>*</span>
                        </div>
                        <FormItem prop="staffCost">
                            <Input class="kld-input" placeholder="请输入科室直接人员费用" :disabled="detail" v-model="selectData.staffCost"></Input>
                            <!-- <kld-input-number :min='0' class="kld-input" placeholder="请输入科室直接人员费用" :disabled="detail" v-model="selectData.staffCost">
                                <span slot="append">万元</span>
                            </kld-input-number> -->
                        </FormItem>
                    </i-col>
                </Row>
                <Row style="margin-bottom: 12px;" :gutter="20">
                    <i-col span="8">
                        <div class="list-title">
                            预计年维修费用：
                            <span class='requiredX'>*</span>
                        </div>
                        <FormItem prop="maintainCost">
                            <Input class="kld-input" placeholder="请输入预计年维修费用" :disabled="detail" v-model="selectData.maintainCost"></Input>

                            <!-- <kld-input-number :min='0' class="kld-input" placeholder="请输入预计年维修费用" :disabled="detail" v-model="selectData.maintainCost">
                                <span slot="append">万元</span>
                            </kld-input-number> -->
                        </FormItem>
                    </i-col>
                    <i-col span="8">
                        <div class="list-title">
                            预计年耗材费用：
                            <span class='requiredX'>*</span>
                        </div>
                        <FormItem prop="consumableCost">
                            <Input class="kld-input" placeholder="请输入预计年耗材费用" :disabled="detail" v-model="selectData.consumableCost"></Input>
                            <!-- <kld-input-number :min='0' class="kld-input" placeholder="请输入预计年耗材费用" :disabled="detail" v-model="selectData.consumableCost">
                                <span slot="append">万元</span>
                            </kld-input-number> -->
                        </FormItem>
                    </i-col>
                    <i-col span="8">
                        <div class="list-title">
                            年收支结余率：
                            <span class='requiredX'>*</span>
                        </div>
                        <FormItem prop="surplus">
                            <Input class="kld-input" placeholder="请输入年收支结余率" :disabled="detail" v-model="selectData.surplus"></Input>

                            <!-- <kld-input-number :min='0' class="kld-input" placeholder="请输入年收支结余率" :disabled="detail" v-model="selectData.surplus">
                                <span slot="append">%</span>
                            </kld-input-number> -->
                        </FormItem>
                    </i-col>
                </Row>
                <Row style="margin-bottom: 12px;" :gutter="20">
                    <i-col span="8">
                        <div class="list-title">
                            预计成本回收期：
                            <span class='requiredX'>*</span>
                        </div>
                        <FormItem prop="recycle">
                            <Input class="kld-input" placeholder="请输入预计成本回收期" :disabled="detail" v-model="selectData.recycle"></Input>
                            <!-- <kld-input-number :min='0' class="kld-input" placeholder="请输入预计成本回收期" :disabled="detail" v-model="selectData.recycle">
                                <span slot="append">年</span>
                            </kld-input-number> -->
                        </FormItem>
                    </i-col>
                </Row>
            </Form>
        </div>

    </div>
</template>
<script>
import typeName from "@common/kld-type/kld-type";
import inputNumber from "@common/kld-input-number";
export default {
    props: {
        detail: {
            default: false
        },
        selectData: {
            type: Object,
            default() {
                return {
                    capitalSource: 0,
                    durableYears: "",
                    rates: "",
                    expectIncome: "",
                    depreciationCost: "",
                    staffCost: "",
                    maintainCost: "",
                    consumableCost: "",
                    surplus: "",
                    recycle: ""
                };
            }
        }
    },
    data() {
        return {
            source: [
                "医院自筹",
                "财政拨款",
                "科研经费支出",
                "重点病种专项基金"
            ],
            year: ["5", "6", "8", "10"],
            ruleSelect: {
                durableYears: [
                    {
                        required: true,
                        message: "该项为必填项"
                    }
                ],
                rates: [
                    {
                        required: true,
                        message: "该项为必填项",
                        trigger: "blur"
                    }
                ],
                expectIncome: [
                    {
                        required: true,
                        message: "该项为必填项",
                        trigger: "blur"
                    }
                ],
                depreciationCost: [
                    {
                        required: true,
                        message: "该项为必填项",
                        trigger: "blur"
                    }
                ],
                staffCost: [
                    {
                        required: true,
                        message: "该项为必填项",
                        trigger: "blur"
                    }
                ],
                maintainCost: [
                    {
                        required: true,
                        message: "该项为必填项",
                        trigger: "blur"
                    }
                ],
                consumableCost: [
                    {
                        required: true,
                        message: "该项为必填项",
                        trigger: "blur"
                    }
                ],
                surplus: [
                    {
                        required: true,
                        message: "该项为必填项",
                        trigger: "blur"
                    }
                ],
                recycle: [
                    {
                        required: true,
                        message: "该项为必填项",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    components: {
        [typeName.name]: typeName,
        [inputNumber.name]: inputNumber
    },
    methods: {
        verify() {
            let temp;
            this.$refs["formValidate"].validate(validate => {
                temp = validate;
            });
            return temp;
        }
    }
};
</script>
<style lang="less" scoped>
.analyze-list {
    /deep/.ivu-select-selected-value {
        color: #545454;
    }
    .list-title {
        padding: 8px 0;
        color: #000000;
    }
    .requiredX {
        color: #f2740c;
    }
}
</style>
