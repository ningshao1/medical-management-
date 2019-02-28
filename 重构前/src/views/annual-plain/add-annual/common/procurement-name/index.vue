<template>
    <div class="pr-name"
         :class="detail?'pr-name-detail':''">
        <kld-type title='设备采购信息'
                  class="step-type"></kld-type>
        <div class="pr-name-content">
            <Form ref="procurement"
                  :model="procurement"
                  :rules="ruleProcurement"
                  :label-width="80"
                  class="pr-rule">
                <div class="pr-name-table"
                     :class="detail?'pr-name-table-detail':''">
                    <table width="100%"
                           border="1">
                        <tr>
                            <th style="width:40%">设备名称
                                <span class="required"
                                      v-if="!detail">*</span>
                            </th>

                            <th>
                                预算单价(万元)
                                <span class="required"
                                      v-if="!detail">*</span>
                            </th>
                            <th>
                                申请数量
                                <span class="required"
                                      v-if="!detail">*</span>
                            </th>
                            <th>
                                国产/进口
                            </th>
                        </tr>
                        <tr>
                            <td>
                                <FormItem prop="assetName">
                                    <Input placeholder="请输入设备名称"
                                           class="kld-input"
                                           v-model='procurement.assetName'
                                           :readonly='detail'
                                           v-if="!detail"></Input>
                                    <div class="omit"
                                         v-else
                                         :title="procurement.assetName">{{procurement.assetName}}</div>
                                </FormItem>
                            </td>
                            <td>
                                <FormItem prop="assetMoney">
                                    <kld-input-number v-model="procurement.assetMoney"
                                                      number
                                                      class="kld-input"
                                                      :readonly='detail'
                                                      :precision='4'></kld-input-number>
                                </FormItem>
                            </td>
                            <td>
                                <FormItem prop="assetNum">
                                    <kld-input-number :precision='0'
                                                      v-model="procurement.assetNum"
                                                      number
                                                      :min='1'
                                                      class="kld-input"
                                                      :readonly='detail'></kld-input-number>
                                </FormItem>
                            </td>
                            <td>
                                <RadioGroup v-model="procurement.importation">
                                    <Radio :label="1"
                                           :disabled='detail'>
                                        <span>国产</span>
                                    </Radio>
                                    <Radio :label="2"
                                           :disabled='detail'>
                                        <span>进口</span>
                                    </Radio>
                                </RadioGroup>
                            </td>
                        </tr>
                    </table>

                    <div class="pr-info">
                        <div class="pr-number">
                            共{{procurement.assetNum}}台
                        </div>
                        <div>总价</div>
                        <div>
                            <span>{{floatLength}}</span>万元</div>

                    </div>

                </div>
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
            default: false,
            type: Boolean
        },
        procurement: {
            type: Object
        },
        buyType: {
            type: Number
        },
        type: {
            type: String,
            default: "1"
        }
    },
    data() {
        return {
            ruleProcurement: {
                assetName: [
                    {
                        required: true,
                        message: "该项为必填项",
                        trigger: "blur"
                    }
                ],
                assetNum: [
                    {
                        validator(rule, value, callback) {
                            if (value !== "" && value !== null) {
                                callback();
                            } else {
                                callback(new Error("该项为必填项"));
                            }
                        }
                    }
                ],
                assetMoney: [
                    {
                        validator: (rule, value, callback) => {
                            if (value !== "" && value !== null) {
                                switch (this.type) {
                                    case "1":
                                        if (this.buyType === 1) {
                                            if (value >= 20 || value < 0) {
                                                callback(
                                                    new Error(
                                                        "请输入0-20万（不含20万）的值"
                                                    )
                                                );
                                            } else {
                                                callback();
                                            }
                                        } else if (this.buyType === 2) {
                                            if (value >= 50 || value < 20) {
                                                callback(
                                                    new Error(
                                                        "请输入20-50万（不含50万）的值"
                                                    )
                                                );
                                            } else {
                                                callback();
                                            }
                                        } else {
                                            callback();
                                        }
                                        break;
                                    case "2":
                                        if (value >= 50 && value < 200) {
                                            callback();
                                        } else {
                                            callback(
                                                new Error(
                                                    "请输入50万（含50万）以上且小于200万（不含200万）的值"
                                                )
                                            );
                                        }
                                        break;
                                    case "3":
                                        if (value >= 200) {
                                            callback();
                                        } else {
                                            callback(
                                                new Error(
                                                    "请输入200万（含200万）以上的的值"
                                                )
                                            );
                                        }
                                }
                            } else {
                                callback(new Error("该项为必填项"));
                            }
                        }
                    }
                ]
            }
        };
    },
    components: {
        [typeName.name]: typeName,
        [inputNumber.name]: inputNumber
    },
    watch: {
        procurement: {
            handler() {
                this.$emit("input", this.procurement);
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        rules() {
            let temp;
            this.$refs["procurement"].validate(valid => {
                temp = valid;
            });
            return temp;
        }
    },
    computed: {
        floatLength() {
            if (this.procurement.assetMoney.toString().split(".")[1]) {
                return (
                    (
                        this.procurement.assetNum *
                        this.procurement.assetMoney *
                        Math.pow(
                            10,
                            this.procurement.assetMoney.toString().split(".")[1]
                                .length
                        )
                    ).toFixed() /
                    Math.pow(
                        10,
                        this.procurement.assetMoney.toString().split(".")[1]
                            .length
                    )
                );
            } else {
                return this.procurement.assetMoney * this.procurement.assetNum;
            }
        }
    }
};
</script>
<style lang="less" scoped>
.pr-name {
    .pr-name-content {
        background-color: #ffffff;
        border-radius: 3px;
        border: solid 1px rgba(2, 31, 57, 0.1);
        padding: 15px 20px;
        table {
            border: none;
            border-collapse: collapse;
            table-layout: fixed;
            tr {
                border-bottom: 1px solid #e2e2e2;
                padding: 0px 0 10px 0;
            }
            th,
            td {
                border: none;
                padding: 20px 20px;
                text-align: left;
                [class*="kld-input"] {
                    height: 40px;
                }
            }
        }
        .pr-info {
            padding: 15px 0 0 0;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            > div {
                margin: 0px 5px;
            }
            > div:nth-of-type(1),
            > div:nth-of-type(2) {
                font-size: 14px;
                color: #666666;
            }
            > div:nth-of-type(3) {
                font-size: 18px;
                color: #666666;
                span {
                    color: #fe881a;
                    padding-right: 5px;
                }
            }
        }
    }
    .required {
        color: #f2740c;
    }
}
.pr-name-detail {
    /deep/.pr-name-table-detail {
        .ivu-input:focus,
        .ivu-input {
            border: none;
            box-shadow: none;
        }
    }
}
/deep/.pr-rule {
    .ivu-form-item-content {
        margin-left: 0 !important;
    }
}
</style>
