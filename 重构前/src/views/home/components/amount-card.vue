<template>
    <div class="amount-card kld-box-effect">
        <show-amount :amount="amount" :unit="unit" :color="color" :title="title"></show-amount>
    </div>
</template>

<style lang="less" scoped>
    .amount-card {
        width: 100%;
        display: inline-block;
        vertical-align: top;
        padding: 30px 22px;
    }
</style>

<script>
    import showAmount from './show-amount';
    export default {
        name: "amount-card",
        components: {showAmount},
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