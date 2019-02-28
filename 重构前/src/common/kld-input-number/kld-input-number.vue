<template>
    <i-input
            ref="kld-input-number"
            @input="inputHandler"
            :value="firstVisibleValue"
            class="kld-input kld-input-number"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            :clearable="clearable"
            @on-blur="blurHandler"
            @on-keyup="$emit('on-keyup', $event)"
            @on-keydown="$emit('on-keydown', $event)"
            :maxlength="computedMaxlength"
            :name="name"
            :autocomplete="autocomplete"
    >
        <slot slot="prepend" name="prepend"></slot>
        <slot slot="append" name="append"></slot>
    </i-input>
</template>

<style lang="less" scoped>
    .kld-input-number {

    }
</style>

<script>

    export default {
        name: "kld-input-number",
        props: {
            value: {
                default: ''
            },

            placeholder: {
                type: String,
                default: ''
            },
            disabled: {
                type: Boolean,
                default: false,
            },
            readonly: {
                type: Boolean,
                default: false,
            },

            number: {           //是否将结果转化为number类型
                type: Boolean,
                default: false,
            },
            clearable:{
                type:Boolean,
                default:false
            },

            max: Number,    //最大值
            min: Number,    //最小值
            precision: Number,   //精确位数
            maxlength: [Number, String],
            isTel:{
                type:Boolean,
                default:false,
            },
            name: {},
            autocomplete: {},
        },

        data() {
            return {
                firstVisibleValue: '',
                triggerIsSelf: false,
            }
        },
        computed: {
            computedMaxlength() {
                let maxlength = this.maxlength;

                if (typeof maxlength === "string") {
                    maxlength = Number.parseInt(maxlength);
                    if (Number.isNaN(maxlength)) {
                        return;
                    }
                }

                return maxlength;
            }
        },
        watch: {
            value: {
                handler(value) {
                    if (this.triggerIsSelf) {
                        this.triggerIsSelf = false;
                    } else {
                        value = this.filterValue(value);
                        this.inputHandler(this.firstVisibleValue = value);
                        this.setVisibleValue(value);
                    }
                },
                immediate: true
            }
        },

        methods: {
            focus() {
                this.$refs['kld-input-number'].focus();
            },

            blurHandler(event) {
                this.setVisibleValue(this.value);
                this.$emit('on-blur', event);
            },

            setVisibleValue(value) {
                const inputComponent = this.$refs['kld-input-number'];
                if (inputComponent) {
                    inputComponent.setCurrentValue(value);
                }
            },

            inputHandler(val) {
                if (! this.readonly && ! this.disabled) {
                    val = this.filterValue(val);

                    if (val !== this.value) {
                        this.triggerIsSelf = true;
                        this.$emit('input', val);
                    }
                }
            },

            filterValue(val) {
                const precision = this.precision,
                    max = this.max,
                    min = this.min;

                let refresh = false;

                val = String(val);

                if (/[^\d\.]/.test(val) && ! /^-\d*$/.test(val)) {
                    refresh = true;
                }
                if(!this.isTel){
                    val = Number.parseFloat(val);
                }else{
                    val=val.replace(/[^\d]/g,'');
                    this.$nextTick(() => this.setVisibleValue(val));
                    return val
                }

                if (Number.isNaN(val)) {
                    val = '';
                } else {
                    if (min !== undefined && val < min) {
                        val = min;
                        refresh = true;
                    } else if (max !== undefined && val > max) {
                        val = max;
                        refresh = true;
                    }
                    if (precision !== undefined) {
                        val = val.toFixed(precision);
                    }
                }

                if (refresh) {
                    this.$nextTick(() => this.setVisibleValue(val));
                }

                return this.number && val !== '' ? Number(val) : String(val);
            }
        }
    }
</script>