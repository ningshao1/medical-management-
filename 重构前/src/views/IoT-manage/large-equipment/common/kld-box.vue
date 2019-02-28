<script type="text/jsx">
    export default {
        name: "kld-box",
        functional: true,
        render(h, ctx) {
            const slots = ctx.slots();
            return (
                <div {...ctx.data} class="kld-box-effect kld-box p-0">
                    <div class="kld-box-title px-20 py-15">
                        {slots.title}
                    </div>
                    <div class="kld-box-content px-20 py-15">
                        {slots.default}
                    </div>
                </div>
            );
        }
    }
</script>

<style lang="less" scoped>
    @import "~@inspection-common/varible";
    .kld-box {
        font-size: 14px;
        &-title{
            border-bottom: 1px solid @border-color;
        }
    }
</style>