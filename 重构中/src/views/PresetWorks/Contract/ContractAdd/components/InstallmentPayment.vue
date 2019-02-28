<template>
    <el-table :data="installmentData" class="installment-payment">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="期数">
            <template slot-scope="{$index}">第{{$index + 1}}期</template>
        </el-table-column>
        <el-table-column label="状态" >
            <template slot-scope="{row: {paymentStatus: status}}">
                <span v-if="status === 1" class="text-orange">已支付</span>
                <template v-else>未支付</template>
            </template>
        </el-table-column>
        <el-table-column label="付款日期" >
            <template slot-scope="{row}">
                <el-date-picker
                        v-model="row.paymentDate"
                        value-format="yyyy-MM-dd"
                        placeholder="付款日期"
                        :disabled="disabled"
                ></el-date-picker>
            </template>
        </el-table-column>
        <el-table-column label="付款金额">
            <template slot-scope="{row}">
                <kld-input-number v-model="row.paymentAmount" :min="0" :precision="2" placeholder="付款金额" :disabled="disabled">
                    <span slot="prepend">￥</span>
                </kld-input-number>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="80px" v-if="statusEditable">
            <template slot-scope="{row, $index}">
                <template v-if="disabled ? editableIndexes.includes($index) : true">
                    <a v-if="row.paymentStatus === 0" href="javascript:" @click="row.paymentStatus = 1">确认支付</a>
                    <a v-else href="javascript:" @click="row.paymentStatus = 0" class="text-disabled">取消支付</a>
                </template>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import {KldCard, KldInputNumber} from '@/components';
    export default {
        name: "installment-payment",
        components: {
            KldCard,
            KldInputNumber
        },
        props: {
            value: {
                type: Array,
                default() {
                    return [];
                }
            },
            periods: {
                type: Number,
                default: 0
            },
            total: {
                type: Number,
                default: 0
            },
            disabled: Boolean,
            statusEditable: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                editableIndexes: []
            };
        },

        computed: {
            installmentData: {
                get() {
                    return this.value;
                },
                set(value) {
                    this.$emit('input', value);
                }
            },
        },
        watch: {
            periods: {
                immediate: true,
                handler(periods) {
                    if (!this.disabled) {
                        const installmentData = this.installmentData = new Array(periods).fill(false).map(
                            (item, i) => ({
                                periods: i + 1,
                                paymentDate: null,
                                paymentAmount: 0,
                                paymentStatus: 0,
                            })
                        );

                        this.computeMoney(this.total, installmentData);
                    }
                }
            },
            total(total) {
                if (!this.disabled) {
                    this.computeMoney(total);
                }
            },
        },
        created() {
            if (this.disabled && this.statusEditable) {
                const unwatch = this.$watch('installmentData', data => {
                    if (data.length > 0) {
                        this.editableIndexes = data
                            .map(
                                (item, index) => item.paymentStatus === 0 ? index : null
                            );

                        unwatch();
                    }
                }, {immediate: true});
            }
        },
        methods: {
            computeMoney(total = this.total, data = this.installmentData) {
                if (this.periods === 3 && total > 0) {
                    [0.6, 0.3, 0.1].reduce(
                        (rest, rate, index) => {
                            rest -= Number(
                                data[index].paymentAmount = (index === 2 ? rest : total * rate).toFixed(2)
                            );

                            return rest;
                        },
                        total
                    );
                }
            }
        }
    }
</script>