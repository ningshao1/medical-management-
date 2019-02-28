<template>
    <button
            @click="click"
            :class="{expanded: value}"
            type="button"
            class="button-search-advanced inline-flex px-10 py-0 align-items-center"
    >
        <span class="pr-6">更多筛选</span>
        <i class="el-icon-arrow-down expand-arrow"></i>
    </button>
</template>

<script>
    export default {
        name: "button-search-advanced",
        props: {
            value: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            click() {
                this.$emit('input', ! this.value);
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "~@/styles/var";
    .button-search-advanced {
        height: $form-control-height-base;
        border: 1px solid $border-color-base;
        background-color: #fff;
        outline: none;
        cursor: pointer;
        color: $color-text-primary;
        .expand-arrow{
            transition: transform .2s;
        }
        &.expanded{
            position: relative;
            overflow: visible;
            background-color: $--table-row-hover-background;
            border-bottom-color: transparent;
            &::after{
                display: block;
                content: '';
                height: 12px;
                position: absolute;
                bottom: -12px;
                left: -1px;
                width: 100%;

                background-color: $--table-row-hover-background;
                border-width: 0 1px;
                border-style: solid;
                border-color: #fff $border-color-base;
            }

            .expand-arrow{
                transform-origin: center center;
                transform: rotateZ(180deg);
            }
        }
    }
</style>