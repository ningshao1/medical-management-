<template>
    <svg
        class="kld-icon kld-icon-wrap"
        :style="styles"
        aria-hidden="true"
    >
        <use :xlink:href="`#${type.trim()}`"></use>
    </svg>
</template>
<script>
export default {
    name: "kld-icon",
    props: {
        type: {
            default: ""
        },
        styles: {
            default() {
                return {};
            }
        }
    }
};
</script>
<style lang="less" scoped>
.kld-icon-wrap {
}
</style>