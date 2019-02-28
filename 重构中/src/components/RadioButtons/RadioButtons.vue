<template>
    <div class="radio-buttons">
        <el-button
                v-for="{label, value} in radioItems"
                :key="value"
                :plain="value === currentValue"
                :type="value === currentValue ? undefined : 'default'"
                @click="buttonClick(value)"
        >{{label}}</el-button>
    </div>
</template>

<script>
    export default {
        name: "radio-buttons",
        props: {
            value: {},
            items: {
                type: Array,
                default() {
                    return [

                    ];
                }
            },
            labelKey: {
                type: String,
                default: 'label'
            },
            valueKey: {
                type: String,
                default: 'value'
            }
        },
        data() {
            return {

            };
        },
        computed: {
            radioItems() {
                const {labelKey, valueKey} = this;
                return this.items.map(
                    item => ({
                        label: item[labelKey],
                        value: item[valueKey]
                    })
                );
            },
            values() {
                return this.radioItems.map(
                    item => item.value
                );
            },
            currentValue: {
                get() {
                    return this.value;
                },
                set(value) {
                    this.$emit('input', value);
                }
            },
            currentLabel() {
                const currentItem = this.radioItems[this.values.indexOf(this.currentValue)];
                return currentItem ? currentItem.label : '';
            }
        },
        methods: {
            buttonClick(value) {
                if (value !== this.currentValue) {
                    this.currentValue = value;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .radio-group{
        display: inline-block;
    }
</style>