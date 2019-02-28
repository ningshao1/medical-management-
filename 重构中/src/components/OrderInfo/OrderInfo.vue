<template>
    <div class="order-info-wrap">
        <div
            :class="_labelClass"
            :style="_labelStyle"
        >
            {{label}}
        </div>
        <div
            :class="_valueClass"
            :style="_valueStyle"
            v-ellipsis-tooltip='value'
        >
            {{value||'--'}}
        </div>

    </div>
</template>
<script>
export default {
    name: "order-info",
    components: {},
    props: {
        label: [String, Number],
        value: {
            default:''
        },
        labelClass: {
            type: String,
            default: ""
        },
        valueClass: {
            type: String,
            default: ""
        },
        labelWidth: {
            default: "100px"
        },
        labelStyle: {
            //优先级高
            default(){
                return {}
            }
        },
        valueStyle:{
            default(){
                return {

                }
            }
        }
    },
    data() {
        return {};
    },
    computed: {
        _labelClass() {
            let extra = this.labelClass.trim();
            extra += extra ? " " + extra : "";
            return "order-info-label" + extra;
        },
        _valueClass() {
            let extra = this.valueClass.trim();
            extra += extra ? " " + extra : "";
            return "order-info-value" + extra;
        },
        _labelStyle() {
            return {
                width: this.labelWidth,
                ...this.labelStyle
            };
        },
        _valueStyle() {
            return {
                ...this.valueStyle
            };
        }
    },
    created() {},
    methods: {}
};
</script>
<style lang="less" scoped>
.order-info-wrap {
    width: 100%;
    display: flex;
    font-size: 14px;
    .order-info-label {
    }
    .order-info-value {
        flex: 1;
        min-width: 0;
    }
}
</style>