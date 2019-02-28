<script type="text/jsx">
    import Dialog from '@/element-ui/Dialog';
    import AlertIcon from './AlertIcon';
    import Base from './Base';
    export default {
        name: "kld-alert",
        mixins: [Base],
        props: {
            type: {
                type: String,
                default: 'info'
            },
            ok: {
                type: [Function, Boolean],
                default: false
            },
            cancel: {
                type: [Function, Boolean],
                default: false
            }
        },

        computed: {
            titleVisible() {
                return Boolean(this.dialogTitle);
            },
            contentVisible() {
                return Boolean(this.dialogContent);
            },
            okBtnType() {
                const {type} = this;
                return type === 'info' ? 'primary' : type;
            }
        },
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
                    width="420px"
                    class="kld-alert"
                >
                    <AlertIcon type={this.type}/>
                    {
                        this.titleVisible ?
                            <div class="kld-alert-title">
                                {this.dialogTitle}
                            </div>
                            :
                            null
                    }
                    {
                        this.contentVisible ?
                            <div class="kld-alert-content">
                                {this.dialogContent}
                            </div>
                            :
                            null
                    }

                    {
                        this.btnsVisible ?
                            <div class="kld-alert-btns flex justify-content-center">
                                {this.cancelBtnVisible ? (
                                    <el-button
                                        onClick={this.cancelHandler}
                                        loading={this.cancelLoading}
                                        disabled={this.cancelDisabled}
                                        type="weaken"
                                    >{this.cancelText}</el-button>
                                ) : null}
                                {this.okBtnVisible ? (
                                    <el-button
                                        onClick={this.okHandler}
                                        loading={this.okLoading}
                                        disabled={this.okDisabled}
                                        type={this.okBtnType}
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
    .kld-alert {
        &-title{
            text-align: center;
            color: $color-text-primary;
            font-size: 16px;
            padding-bottom: 20px;
        }
        &-content{
            padding-bottom: 20px;
            line-height: 22px;
            color: $color-text-secondary;
            text-align: center;
        }
    }
</style>