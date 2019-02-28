<template>
    <form-item v-bind="$attrs" v-on="$listeners" :class="{'kld-form-item': hasScopedSlotLabel}">
        <template slot="label">
            <slot v-if="hasScopedSlotLabel" name="label" v-bind="{Asterisk}"></slot>
            <template v-else>
                <slot name="label">{{label}}</slot>
            </template>
        </template>
        <slot></slot>
        <template v-if="$scopedSlots.error" slot="error" slot-scope="scope">
            <slot name="error" v-bind="scope"></slot>
        </template>
    </form-item>
</template>

<script>
    import FormItem from './FormItemModify';
    import Asterisk from './Asterisk';
    export default {
        name: "kld-form-item",
        components: {
            FormItem,
            Asterisk
        },
        props: {
            label: String
        },
        computed: {
            hasScopedSlotLabel() {
                return Boolean(
                    this.$scopedSlots.label
                );
            },
            Asterisk() {
                return Asterisk;
            }
        }
    }
</script>

<style lang="scss">
    @import "~element-ui/packages/theme-chalk/src/mixins/mixins";

    @include b(form-item) {
        &.kld-form-item{
            @include when(required) {
                @include pseudo('not(.is-no-asterisk)') {
                    &>.el-form-item__label{
                        &::after{
                            all: unset;
                        }
                    }
                }
            }

            &:not(.is-required){
                .kld-form-item-asterisk{
                    display: none;
                }
            }
        }
    }
</style>