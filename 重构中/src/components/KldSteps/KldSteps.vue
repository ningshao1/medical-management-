<template>
    <div class="kld-steps">
        <div
                v-for="(step, index) in steps"
                :class="{
                    active: active > index,
                    current: active === index
                }"
                class="kld-step flex align-items-center"
        >

            <div class="kld-step-icon flex align-items-center justify-content-center">
                <i v-if="active > index" class="el-icon-check"></i>
                <span v-else>{{index + 1}}</span>
            </div>
            <div class="kld-step-title ml-8">
                {{step.title}}
            </div>
            <i v-if="index < steps.length - 1" class="kld-step-arrow el-icon-arrow-right ml-18 mr-8"></i>
        </div>
    </div>
</template>

<script>
    export default {
        name: "kld-steps",

        props: {
            active: {
                type: Number,
                default: 1
            },
            steps: {
                type: Array,
                default() {
                    return [
                        // {title: '第一步'},
                        // {title: "第二部"},
                        // {title: '第三步'}
                    ];
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "~@/styles/var";
    $prefix: kld-step;
    $color-icon-default: #bcc0c2;
    .#{$prefix}s {
        display: flex;
        justify-content: center;
        font-size: $font-size-base;
        .#{$prefix}{
            &-icon{
                width: 22px;
                height: 22px;
                border-radius: 50%;
                line-height: 1;
                background-color: rgba(0, 0, 0, 0.05);
            }
            &-title{

            }
            &-arrow{
                color: $color-icon-default;
            }


            &.active{
                color: $color-primary;
                .#{$prefix}-icon{
                    background-color: $color-primary;
                    color: #fff;
                }
                .#{$prefix}-arrow{
                    color: inherit;
                }
            }

            &.current{
                $color-current: rgba($color-primary, 0.75);
                color: $color-current;
                .#{$prefix}-icon{
                    background-color: $color-current;
                    color: #fff;
                }
            }
        }
    }
</style>