<template>
    <div class="step-progress">
        <div v-for="(item, index) in data" :class="{active: index <= progress}" class="step-progress-item">
            <div class="step-progress-title">
                <span>{{item.title}}</span>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
    @color-default: #adb5b7;
    @color-active: #22a1b9;
    .step-progress {
        display: flex;
        .step-progress-item{
            color: @color-default;
            display: flex;
            &::before{
                content: '';
                display: block;
                width: 68px;
                height: 0;
                border-top: 1px solid;
                margin-top: 2px;
                flex-shrink: 0;
            }
            &:first-of-type{
                &::before{
                    display: none;
                }
            }

            .step-progress-title{
                flex-shrink: 0;
                border-top: 5px solid;
                line-height: 1;
                font-size: 14px;
                padding: 8px 8px 0 8px;
                >span{
                    color: #666666;
                }
            }
            &.active{
                color: @color-active;
                .step-progress-title{
                    >span{
                        color: @color-active;
                    }
                }
            }
        }
    }
</style>

<script>
    export default {
        name: "step-progress",
        props: {
            data: {
                type: Array,
                default() {
                    return [];
                }
            },
            value: {}
        },
        computed: {
            progress() {
                return this.data.findIndex(
                    ({value}) => value === this.value
                );
            }
        }
    }
</script>