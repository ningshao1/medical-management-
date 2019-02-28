<script type="text/jsx">
    import ElTabs from 'element-ui/lib/tabs';
    export default ElTabs;
</script>

<style lang="scss">
    @import "~@/styles/var";
    $--border-color-light: $border-color-base;
    $background-color-tab-item: #e8e8e8;

    @import "~element-ui/packages/theme-chalk/src/tabs";
    @import "~element-ui/packages/theme-chalk/src/tab-pane";
    @include b(tabs) {
        @include e(item) {
            width: 80px;
            box-sizing: content-box;
            text-align: center;
        }
        @include e(nav-wrap) {
            &::after {
                height: 1px;
            }
        }

        @include m(card) {
            @include e(item) {
                box-sizing: border-box;
            }
            > .el-tabs__header .el-tabs__nav {
                border-radius: $border-radius-base;
            }
            > .el-tabs__header .el-tabs__item{
                width: 100px;
                padding: 12px 0 !important;
                text-align: center;
                height: auto;
                line-height: $line-height-base;
                background-color: $background-color-tab-item;
                &:not(.is-active){
                    border-bottom-color: $border-color-base;
                }
                &.is-active{
                    background-color: transparent;
                    position: relative;
                    &::before{
                        content: '';
                        display: block;
                        position: absolute;
                        width: 100%;
                        height: 0;
                        border-top: 2px solid;
                        left: 0;
                        top: -1px;
                    }
                }
            }
        }

        @include m(border-card) {
            @include e(item) {
                box-sizing: border-box;
            }
            box-shadow: none;
            border: 0;
            >.el-tabs__header {
                background-color: transparent;
                border-bottom: 0;
                .el-tabs__item{
                    text-align: center;
                    width: 120px;
                    padding: 16px 0 !important;
                    line-height: $line-height-base;
                    height: auto;
                    background-color: $background-color-tab-item;
                    border-color: $border-color-base;
                    &:last-of-type{
                        border-right-color: transparent;
                    }
                    &.is-active{
                        background-color: #fff;
                        border-bottom-color: transparent;
                    }
                }
            }
        }
    }
</style>
