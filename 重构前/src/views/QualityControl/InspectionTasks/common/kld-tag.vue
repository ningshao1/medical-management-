<template>
    <div :class="['kld-tag', `kld-tag-${type}`]"><slot></slot></div>
</template>
<style lang="less" scoped>
    @import "./varible";
    .kld-tag{
        font-size: 12px;
        color: #fff;
        padding: 0 8px;
        border-radius: 4px;
        line-height: 26px;
        display: inline-block;
        vertical-align: middle;
    }
    .kld-tag-success{
        background-color: @color-success;
    }
    .kld-tag-error{
        background-color: @color-error;
    }
    .kld-tag-default{
        background-color: @color-default;
    }
    .kld-tag-warning{
        background-color: @color-warning;
    }
    .kld-tag-purple{
        background-color: @color-purple;
    }
</style>

<script>
    export default {
        name: "kld-tag",
        props: {
            type: {
                type: String,
                default: 'default'
            }
        }
    }
</script>