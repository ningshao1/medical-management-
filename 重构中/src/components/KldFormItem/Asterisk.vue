<script type="text/jsx">
    export default {
        name: "kld-form-item-asterisk",
        functional: true,
        render(h, ctx) {
            return (
                <span {...ctx.data} class="kld-form-item-asterisk">*</span>
            );
        }
    }
</script>

<style lang="scss" scoped>
    @import "~@/styles/var";
    .kld-form-item-asterisk {
        color: $color-error;
    }
</style>