<template>
    <Button class="add-btn" icon="plus-round" type="dashed" @click="click">
        <slot></slot>
    </Button>
</template>

<style lang="less" scoped>
    .add-btn {
        box-shadow: none;
        width: 100%;
        color: #0c8399;
        border-color: #dcdcdc;
        &:active {
            border-color: #0c8399;
        }
    }
</style>

<script>
    export default {
        name: "add-btn",
        methods: {
            click(...arg) {
                this.$emit('click', ...arg)
            }
        }
    }
</script>