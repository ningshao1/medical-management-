<script type="text/jsx">
    import Dialog from '@/element-ui/Dialog';
    import Base from './Base';
    export default {
        name: "kld-confirm",
        mixins: [Base],
        render() {
            const
                data = {
                    on: {
                        'update:visible': this.updateVisible,
                        closed: this.closed
                    }
                };

            return (
                <Dialog
                    {...data}
                    visible={this.visible}
                    width="408px"
                    class="kld-confirm"
                >
                    <template slot="title">{this.dialogTitle}</template>
                    <div class="kld-confirm-content">
                        {this.dialogContent}
                    </div>
                    {
                        this.btnsVisible ?
                            <div class="kld-confirm-btns flex justify-content-center">
                                {this.cancelBtnVisible ? (
                                    <el-button
                                        onClick={this.cancelHandler}
                                        loading={this.cancelLoading}
                                        disabled={this.cancelDisabled}
                                        type="default"
                                    >{this.cancelText}</el-button>
                                ) : null}
                                {this.okBtnVisible ? (
                                    <el-button
                                        onClick={this.okHandler}
                                        loading={this.okLoading}
                                        disabled={this.okDisabled}
                                        type="primary"
                                    >{this.okText}</el-button>
                                ) : null}
                            </div>
                            :
                            null
                    }
                </Dialog>
            );
        }
    }
</script>

<style lang="scss" scoped>
    @import "~@/styles/var";

    .kld-confirm{
        &-content{
            padding: 10px 0 30px;
            color: $color-text-secondary;
            text-align: center;
        }
        &-btns{
            padding-bottom: 10px;
        }
    }
</style>