<template>
    <div class="kld-title">
        <slot></slot>
    </div>
</template>

<style lang="less" scoped>
    .kld-title {
        width: 100%;
        font-size: 16px;
        padding: 17px 0;
        color: #f2740c;
        border-bottom: 1px solid #dedede;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>

<script>
    export default {
        name: "kld-title",
        props: {
            title: String
        },
    }
</script>