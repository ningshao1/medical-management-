<template>
    <div class="show-amount">
        <p class="title">{{title}}</p>
        <div class="amount-wrap">
            <span :style="amountStyles" class="amount">
                <number-transition :end="amount"></number-transition>
            </span>
            <span v-if="unit" class="unit">{{unit}}</span>
        </div>
    </div>
</template>

<style lang="less" scoped>
    .show-amount {
        
    }
    .title{
        color: #666;
        font-size: 16px;
    }
    .amount-wrap{
        margin-top: 5px;
    }
    .unit{
        color: #a9a8a9;
        font-size: 18px;
    }
    .amount{
        font-size: 50px;
        margin-right: 8px;
    }
</style>

<script>
    import numberTransition from '@common/number-transtion/index.vue';

    export default {
        name: "show-amount",
        components: {numberTransition},
        computed: {
            amountStyles() {
                return {
                    color: this.color
                };
            }
        },
        props: {
            unit: {
                type: String
            },
            color: {
                type: String,
                default: '#22a1b9'
            },
            title: {
                type: String
            },
            amount: {
                type: [Number, String]
            }
        }
    }
</script>