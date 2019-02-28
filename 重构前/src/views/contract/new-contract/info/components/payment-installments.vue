<template>
    <div class="payment-installments">
        <Row type="flex" align="middle" class="mt-10 mb-10">
            <i-col class="mr-20">
                <Checkbox :disabled="disabled" v-model="isInstallment">分期付款</Checkbox>
            </i-col>
            <i-col class="w-20">分</i-col>
            <i-col style="width: 100px;">
                <kld-input-number v-model="periods" number :min="periodsMin" :disabled="! isInstallment || disabled"/>
            </i-col>
            <i-col class="w-20">期</i-col>
        </Row>
        <div v-if="isInstallment">
            <p>分期详情：</p>
            <table class="installment-table table-stripe">
                <thead>
                <tr>
                    <th>序号</th>
                    <th>期数</th>
                    <th>付款日期</th>
                    <th>付款金额</th>
                    <th>付款状态</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="row in installmentPlains">
                    <td>
                        {{row.periods}}
                    </td>
                    <td>
                        第{{row.periods}}期
                    </td>
                    <td>
                        <DatePicker
                                :value="row.paymentDate"
                                :disabled="disabled"
                                class="input-width"
                                placeholder="请选择付款日期"
                                @on-change="row.paymentDate = $event"
                        ></DatePicker>
                    </td>
                    <td>
                        <kld-input-number
                            v-model="row.paymentAmount"
                            class="input-width"
                            placeholder="请输入付款金额"
                            :precision="2"
                            :disabled="disabled"
                        />
                    </td>
                    <td>
                        <template v-if="disabled && ! moneyEditableRows.includes(row)">
                            <span v-if="row.paymentStatus === 0" class="kld-default">未付</span>
                            <span v-else class="kld-success">
                                已付<Icon class="ml-4" size="12" type="checkmark-round"/>
                            </span>
                        </template>
                        <Switch
                                v-else
                                v-model="row.paymentStatus"
                                size="large"
                                :true-value="1"
                                :false-value="0"
                        >
                            <template slot="open">已付</template>
                            <template slot="close">未付</template>
                        </Switch>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style lang="less" scoped>
    @import "~@inspection-common/varible";
    @border-style: 1px solid @border-color;
    .payment-installments {
        /deep/ .input-width{
            width: 100%;
            max-width: 250px;
            height: 32px;
        }

        .installment-table{
            width: 100%;
            table-layout: fixed;
            text-align: left;
            border-collapse: collapse;
            border: @border-style;
            tr{
                border-bottom:  @border-style;
            }

            td,th{
                padding-left: 14px;
                padding-right: 14px;
            }

            th{
                height: 40px;
                background-color: #f8f8f9;
            }
            td{
                height: 46px;
            }
        }
    }
</style>

<script type="text/jsx">
    import {KldTable} from '@/components';
    import KldInputNumber from '@/common/kld-input-number';
    export default {
        name: "payment-installments",
        components: {
            KldTable,
            KldInputNumber
        },
        props: {
            value: {
                type: Array,
                default() {
                    return [];
                }
            },
            disabled: {
                type: Boolean,
                default: false
            },
            total: {
                type: [String, Number],
                default: 0
            },

            moneyEditableRows: {
                type: Array,
                default() {
                    return [];
                }
            }
        },

        data() {
            return {
                isInstallment: false
            };
        },

        computed: {
            totalMoney() {
                return Number(this.total) || 0;
            },
            periods: {
                get() {
                    return this.installmentPlains.length;
                },
                set(val) {
                    this.installmentPlains = this.generateInstallmentPlains(val);
                }
            },
            periodsMin() {
                return this.isInstallment ? 1 : 0;
            },

            installmentPlains: {
                get() {
                    return this.value;
                },
                set(val) {
                    this.internalChange = true;
                    this.$emit('input', val);
                }
            }
        },

        watch: {
            installmentPlains(plains) {
                if (this.internalChange) {
                    this.internalChange = false;
                } else {
                    if (plains.length > 0) {
                        this.isInstallment = true;
                    }
                }
            },

            totalMoney() {
                if (this.periods === 3 && ! this.disabled) {
                    this.installmentPlains = this.computeInstallmentMoney(this.installmentPlains);
                }
            },

            isInstallment: {
                immediate: true,
                handler(val) {
                    if (val) {
                        if (this.installmentPlains.length === 0) {
                            this.periods = 3;
                        }
                    } else {
                        this.periods = 0;
                    }
                }
            }
        },

        methods: {
            generateInstallmentPlains(periods = this.periods) {
                const result = [];
                for (let i = 0; i < periods; i ++) {
                    result.push({
                        periods: i + 1,
                        paymentDate: '',
                        paymentAmount: '',
                        paymentStatus: 0,
                    });
                }

                if (periods === 3) {
                    this.computeInstallmentMoney(result);
                }

                return result;
            },

            computeInstallmentMoney(installmentPlains = this.installmentPlains) {
                const total = this.totalMoney;
                [0.6, 0.3, 0.1].reduce(
                    (rest, rate, index) => {
                        rest -= Number(
                            installmentPlains[index].paymentAmount = (index === 2 ? rest : total * rate).toFixed(2)
                        );

                        return rest;
                    },
                    total
                );

                return installmentPlains;
            },

            validate() {
                if (this.installmentPlains.length > 0) {
                    if (! this.installmentPlains.every(({paymentDate}) => paymentDate)) {
                        this.$Message.warning('分期付款日期为必填');
                        return false;
                    } else if (
                        Number(this.installmentPlains.reduce((money, {paymentAmount}) => money + Number(paymentAmount), 0).toFixed(2))
                        !== this.totalMoney
                    ) {
                        this.$Message.warning('分期总金额必须等于采购金额');
                        return false;
                    }
                }
                return true;
            }
        }
    }
</script>