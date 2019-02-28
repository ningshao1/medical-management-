<script type="text/jsx">
    export default {
        name: 'page-tips',
        functional: true,
        render(h, {data, slots}) {
            const {default: defaultSlot, title} = slots();

            return (
                <div class="page-tips" {...data}>
                    {title ? <h2 class="page-tips-title text-primary fz-16 font-weight-normal border-bottom-1">{title}</h2> : null}
                    <div class="page-tips-content text-regular pt-10 fz-14">
                        {defaultSlot}
                    </div>
                </div>
            );
        }
    }
</script>

<style lang="scss" scoped>
    @import "~@/styles/var";
    .page-tips {
        &-title{
            line-height: 16px + 13px * 2;
        }
        &-content{
            line-height: 30px;
        }
    }
</style>