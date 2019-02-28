<template>
    <div class="add-table">
        <div>
            <Form ref="table-form"
                  :model="tableData"
                  inline>

                <table class='table-stripe'
                       style="border-collapse: collapse;">
                    <tr>
                        <th>序号</th>
                        <th>设备名称
                            <span style="color:#f2740c">*</span>
                        </th>
                        <th>申请数量
                            <span style="color:#f2740c">*</span>
                        </th>
                        <th style="width:200px">预算单价</th>
                        <th>意向品牌（多选）</th>
                        <th>备注</th>
                        <th>操作</th>
                    </tr>

                    <tr v-for="(item,index) in tableData.annualplanPurchases">
                        <td>0{{index+1}}</td>
                        <td>
                            <FormItem label=""
                                      :prop="'annualplanPurchases.' + index + '.ap_name'"
                                      :rules="{required: true, message: '该项为必填项', trigger: 'blur'}">
                                <i-input class="add-table-input"
                                         type="text"
                                         v-model='item.ap_name'
                                         placeholder='请输入名称'>
                                </i-input>
                            </FormItem>

                        </td>
                        <td>
                            <FormItem label=""
                                      :prop="'annualplanPurchases.' + index + '.ap_number'"
                                      :rules="[{required: true, message: '该项为必填项', trigger: 'blur'},{
                                          validator: numberRule, trigger: 'blur'
                                      }]">
                                <i-input class="add-table-input asset-name"
                                         v-model='item.ap_number'
                                         placeholder='请输入数量'>
                                </i-input>
                            </FormItem>
                        </td>
                        <td>

                            <FormItem label=""
                                      :prop="'annualplanPurchases.' + index + '.ap_money'"
                                      :rules="[{required: true, message: '该项为必填项', trigger: 'blur'},{
                                          validator: moneyRule, trigger: 'blur'
                                      }]">
                                <i-input class="add-table-input asset-number"
                                         v-model='item.ap_money'
                                         placeholder='请输入价格'>
                                    <span slot='append'>元</span>
                                </i-input>
                            </FormItem>

                        </td>
                        <td>
                            <Select v-model="item.ap_brand"
                                    class='kld-select'
                                    multiple
                                    style="width:100%;line-height: 33px;text-align:left;overflow: hidden;">
                                <Option v-for="brand in brandData"
                                        :value="brand.brandName"
                                        :key="brand.brandName">
                                </Option>
                            </Select>
                        </td>
                        <td>
                            <i-input type="text"
                                     v-model='item.ap_note'
                                     placeholder='请输入备注'
                                     class="add-table-input">
                            </i-input>
                        </td>
                        <td>
                            <span @click="addRow">添加</span>
                            <span @click="delRow(index)"
                                  v-if="tableData.annualplanPurchases.length>1">删除</span>
                        </td>
                    </tr>
                </table>
            </Form>
        </div>
    </div>
</template>
<script>
import confirm from "@common/kld-confirm/index";
export default {
    name: "add-table",
    props: {
        value: {
            required: true
        },
        ar_Type: {
            required: true
        }
    },
    data() {
        return {
            brandData: []
        };
    },
    computed: {
        tableData: {
            set(val) {
                this.$emit("input", val);
            },
            get() {
                return this.value;
            }
        }
    },
    created() {
        this.getlabelData();
    },
    methods: {
        //新增品牌管理
        getlabelData() {
            this.$axios
                .post(`/assertBrandcopys/${this.$store.state.osId}/list`, {
                    limit: 10000,
                    offset: 0,
                    params: {
                        departmentId: this.$store.state.osId
                    }
                })
                .then(({ data: { data } }) => {
                    this.brandData = data;
                });
        },
        numberRule(rule, value, callback) {
            if (typeof value !== "string" || /^\+?[1-9][0-9]*$/.test(value)) {
                callback();
            } else {
                callback(new Error("请输入正确的数量"));
            }
        },
        moneyRule(rule, value, callback) {
            if (
                typeof value !== "string" ||
                /(^[1-9]([0-9]+)?(\.[0-9]*)?$)|(^(0){1}$)|(^(0){1}\.[0-9]+$)/.test(
                    value
                )
            ) {
                const money = Number(value);
                if (
                    (this.ar_Type === 0 && money > 0 && money < 100000) ||
                    (this.ar_Type === 1 && money >= 100000 && money < 500000) ||
                    (this.ar_Type === 2 && money >= 500000)
                ) {
                    callback();
                } else {
                    callback(new Error("请输入正确的金额范围"));
                }
            } else {
                callback(new Error("请输入正确的金额"));
            }
        },
        addRow() {
            this.tableData.annualplanPurchases.push({
                ap_name: null,
                ap_number: null,
                ap_money: null,
                ap_brand: [],
                ap_note: null
            });
        },
        delRow(index) {
            confirm({
                title: "提示",
                content: "是否删除",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "取消", //确认取消文本  默认:取消
                ok: () => {
                    this.tableData.annualplanPurchases.splice(index, 1);
                }
            });
        },
        submit() {
            return new Promise((resolve, reject) => {
                this.$refs["table-form"].validate(valid => {
                    if (valid) {
                        resolve();
                    } else {
                        reject();
                    }
                });
            });
        }
    }
};
</script>

<style lang="less" scoped>
.add-table {
    /deep/.ivu-form-item-error-tip {
        padding-top: 1px;
    }
}
table {
    width: 100%;
    text-align: center;
    border: none;

    tr {
        border-bottom: solid 1px rgba(2, 31, 57, 0.1);

        th {
            border-left: none;
            border-right: none;
            height: 40px;
        }

        td {
            padding: 10px;
            // padding-bottom: 20px;
            border-left: none;
            border-right: none;
            > div {
                width: 80%;
            }
            > span {
                color: #5ba4c8;
                padding: 0 3px;
                cursor: pointer;
                &:active {
                    opacity: 0.8;
                }
            }
        }

        td:nth-of-type(2) {
            width: 20%;
        }
        td:nth-of-type(3) {
            width: 15%;
        }
        td:nth-of-type(5) {
            width: 20%;
        }
        td:nth-of-type(6) {
            width: 15%;
        }
        td:nth-of-type(7) {
            width: 10%;
        }
    }
}
/deep/[class*="add-table-input"] {
    height: 38px;
    .ivu-input {
        height: 100%;
    }
}
/deep/.asset-number {
    height: 41px;
}
</style>
