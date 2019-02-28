<template>
    <span class="kld-tag" :class="classes" :style="styles" @click="click" :size="size">
        <slot></slot>
        <a v-if="hasCloseBtn" @click.stop="close" class="close" href="javascript:">
            <i class="el-icon-close"></i>
        </a>
    </span>
</template>

<script type="text/jsx">
    import {isDef, isValid} from '@/utils';
    export default {
        name: "kld-tag",
        props: {
            type: String,
            color: String,
            size: String,
        },
        computed: {
            hasCloseBtn() {
                return Boolean(
                    this.$listeners.close
                );
            },
            clickable() {
                return Boolean(
                    this.$listeners.click
                );
            },
            styles() {
                const {color} = this;
                if (isDef(color)) {
                    return {
                        color,
                        borderColor: color
                    };
                } else {
                    return {};
                }
            },
            classes() {
                const classes = {
                    clickable: this.clickable,
                };

                if (!isValid(this.color)) {
                    classes[`tag-${this.type}`] = isValid(this.type);
                }

                return classes;
            }
        },
        methods: {
            close() {
                this.$emit('close');
            },
            click() {
                if (this.clickable) {
                    this.$emit('click');
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "~@/styles/var";
    $border-width: 1px;
    /*@function getLineHeightFromHeight($height) {
        @return $height - $border-width * 2;
    }*/
    @mixin tag-line-height($height) {
        line-height: $height - $border-width * 2;
    }
    .kld-tag {
        @include tag-line-height(26px);
        display: inline-block;
        padding: 0 5px;
        border: $border-width solid $border-color-base;
        color: $color-text-regular;
        font-size: 14px;
        background-color: #fff;
        &+&{
            margin-left: 6px;
        }
        &.clickable{
            cursor: pointer;
        }
        &[size=small]{
            font-size: 12px;
            @include tag-line-height(18px);
        }
        &.tag-primary{
            color: $color-primary;
            border-color: $color-primary;
        }
        &.tag-success{
            color: $color-success;
            border-color: $color-success;
        }
        &.tag-warning{
            color: $color-warning;
            border-color: $color-warning;
        }
        &.tag-danger{
            color: $color-error;
            border-color: $color-error;
        }
        &.tag-info{
            color: $color-info;
            border-color: $color-info;
        }

        >.close{
            margin-left: 8px;
            color: inherit;
        }
    }
</style>