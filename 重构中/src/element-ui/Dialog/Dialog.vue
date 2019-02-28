<script type="text/jsx">
    import Dialog from 'element-ui/lib/dialog';

    export default {
        extends: Dialog,
        name: Dialog.name,
        computed: {
            hasHeader() {
                return Boolean(
                    this.$slots.title || this.title
                );
            },
            isBodyGrey() {
                const width = (this.width || '').trim();
                if (width.endsWith('px')) {
                    const widthValue = Number.parseFloat(width);
                    if (! Number.isNaN(widthValue)) {
                        return widthValue >= 1200;
                    }
                }
                return false;
            },
        },
        watch: {
            hasHeader: {
                immediate: true,
                async handler(hasHeader) {
                    if (! this.$el) {
                        await this.$nextTick();
                    }
                    if (hasHeader) {
                        this.$el.removeAttribute('header-hide');
                    } else {
                        this.$el.setAttribute('header-hide', 'true');
                    }
                }
            },
            isBodyGrey: {
                immediate: true,
                async handler(isBodyGrey) {
                    if (! this.$el) {
                        await this.$nextTick();
                    }
                    if (isBodyGrey) {
                        this.$el.setAttribute('body-grey', 'true');
                    } else {
                        this.$el.removeAttribute('body-grey');
                    }
                }
            },
        }
    };
</script>

<style lang="scss">
    @import "~@/styles/var";
    @import "~element-ui/packages/theme-chalk/src/dialog";
    .el-dialog__wrapper{
        &[header-hide]{
            >.el-dialog{
                >.el-dialog__header{
                    display: none;
                }
            }
        }
        &[body-grey]{
            >.el-dialog{
                >.el-dialog__body{
                    background-color: $body-background-color;
                }
            }
        }
    }
    @include b(dialog) {
        @include e(header) {
            background-color: $dialog-header-background-color;
            color: $--color-white;
            min-height: 16px;
        }
        @include e(headerbtn) {
            top: 10px;
            right: 24px;
            font-size: $--message-close-size;
            color: inherit;
            .el-dialog__close {
                color: inherit !important;
            }
        }
        @include e(title) {
            color: inherit;
        }

        @include e(body) {
            padding: $dialog-body-padding;
            background-color: #fff;
        }
        
        @include e(footer) {
            background-color: $dialog-footer-background-color;
        }
    }
</style>