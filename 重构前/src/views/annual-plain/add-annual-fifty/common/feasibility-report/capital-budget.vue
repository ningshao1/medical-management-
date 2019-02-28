<template>
    <div class="capital-budget-wrap" :style="details?'':'min-height:320px;'">
        <Form ref="capitalBudget" :model="formData" :rules="ruleValidate">
            <i-row :gutter="20">
                <i-col span='8' style="height:80px;">
                    <FormItem prop="assetMoney" label="预算单价：">
                        <kld-input-number :maxlength="11" number :disabled="details||!singleInfo.editing" class="kld-input" placeholder="请输入设备预算单价" v-model="formData.assetMoney">
                                <span slot="append">万元</span>
                        </kld-input-number>
                    </FormItem>
                </i-col>
                <i-col span='8' style="height:80px;">
                   <FormItem prop="assetNum" label="数量：">
                        <kld-input-number :precision='0' number :maxlength="11" :disabled="details||!singleInfo.editing" class="kld-input" placeholder="请输入数量" v-model="formData.assetNum"></kld-input-number>
                    </FormItem>
                </i-col>
                <i-col span='8' style="height:80px;">
                   <FormItem prop="totalPrice" label="预算总价：">
                        <i-input class="kld-input" :disabled="true" placeholder="系统自动计算" v-model="formData.totalPrice">
                            <span slot="append">万元</span>
                        </i-input>
                    </FormItem>
                </i-col>
                <i-col span='8' style="height:80px;" >
                   <FormItem prop="capitalSource" label="资金来源：">
                        <Select :disabled="details||!singleInfo.editing" class="kld-select" placeholder="请选择" v-model="formData.capitalSource">
                            <Option :value="1">{{'医院自筹'}}</Option>
                            <Option :value="2">{{'财政拨款'}}</Option>
                            <Option :value="3">{{'科研经费支出'}}</Option>
                            <Option :value="4">{{'重点病种专项基金'}}</Option>
                        </Select>
                    </FormItem>
                </i-col>
            </i-row>
            <div tabindex="0"></div>
        </Form>
    </div>
</template>

<script>
import kldInputNumber from "@common/kld-input-number";
export default {
    name: "capital-budget",
    components: { kldInputNumber },
    data() {
        const validate = (rule, value, callback) => {
            if (value && (value >=200 || value < 50) && this.type === 2) {
                return callback(new Error("预算单价应介于50~200万(不包200万)！"));
            }
            if (value && value < 200 && this.type === 3) {
                return callback(new Error("预算单价应高于200万(包含200万)！"));
            }
            callback();
        };
        return {
            formData: {
                assetMoney: null,
                assetNum: null,
                totalPrice: null,
                capitalSource: null
            },
            ruleValidate: {
                assetMoney: { required: true,validator: validate  },
                assetNum: { required: true, message: "该项为必填项" },
                totalPrice: { required: true, message: "该项为必填项" },
                capitalSource: { required: true, message: "该项为必填项" }
            }
        };
    },
    computed: {
        type() {
            return +this.$route.query.type;
        }
    },
    props: {
        details: {
            type: Boolean,
            default: false
        },
        singleInfo: {
            type: Object
        }
    },
    watch: {
        formData: {
            handler() {
                if (this.isNumber(this.formData.assetMoney)&&this.isNumber(this.formData.assetNum)) {
                    let Median=10**this.floatLength(this.formData.assetMoney);
                    this.formData.totalPrice =(+(this.formData.assetMoney*Median).toFixed()) * this.formData.assetNum/Median;
                }
                this.singleInfo.tabPaneInfo = JSON.parse(
                    JSON.stringify(this.formData)
                ); //for 同步
            },
            deep: true
        },
        "singleInfo.savedInfo": {
            handler(ND) {
                this.formData = ND;
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        isNumber(num){
            return num===+num; 
        },
        floatLength(num){//获得小数个数
            return num.toString().split('.')[1]?num.toString().split('.')[1].length:0;
        },
        edit(v) {
            v.editing = true;
        },
        cancel(v) {
            if (v.saved) {
                v.editing = false;
            }
            this.formData = JSON.parse(JSON.stringify(v.savedInfo));
        },
        save(v, postCache) {
            this.$refs.capitalBudget.validate(valid => {
                if (valid) {
                    this.$axios
                        .post(
                            "/annualPlanTmp/saveAnnualPlanMoreCaChe",
                            postCache
                        )
                        .then(res => {
                            this.$store.commit("setReportData", postCache);
                            v.nonempty = true;
                            v.saved = true;
                            v.editing = false;
                            v.savedInfo = JSON.parse(
                                JSON.stringify(this.formData)
                            );
                        });
                } else {
                    v.saved = false;
                    v.editing = true;
                }
            });
        }
    }
};
</script>


<style lang="less" scoped>
.capital-budget-wrap {
    width: 100%;
    // min-height: 350px;
    .ivu-col {
        margin-bottom: 15px;
    }
    /deep/.ivu-select-disabled .ivu-select-selection {
        color: #495060;
    }
}
</style>
