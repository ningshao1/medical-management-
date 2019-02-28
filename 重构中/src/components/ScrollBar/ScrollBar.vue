<template>
    <div class="scroll-bar-wrap">
        <slot></slot>
    </div>
</template>

<script>
    import PerfectScrollbar from 'perfect-scrollbar';
    export default {
        name: "scroll-bar",
        props: {
            handlers: Array,
            wheelSpeed: Number,
            minScrollbarLength: Number,
            maxScrollbarLength: Number,
            scrollingThreshold: Number,
            scrollXMarginOffset: Number,
            scrollYMarginOffset: Number,
            wheelPropagation: {
                type: Boolean,
                default: undefined
            },
            swipeEasing: {
                type: Boolean,
                default: undefined
            },
            useBothWheelAxes: {
                type: Boolean,
                default: undefined
            },
            suppressScrollX: {
                type: Boolean,
                default: undefined
            },
            suppressScrollY: {
                type: Boolean,
                default: undefined
            }
        },
        mounted() {
            const
                options = JSON.parse(JSON.stringify(this.$props)),
                scrollbar = new PerfectScrollbar(this.$el, options);

            this.$on('hook:beforeDestroy', () => {
                scrollbar.destroy();
            });
        },
        render() {
            const slots = this.$slots.default;
            return Array.isArray(slots) ? slots[0] : slots;
        }
    }
</script>

<style lang="scss">
    @import "~perfect-scrollbar/css/perfect-scrollbar.css";
    $scrollbar-active-height: 8px;

    .ps .ps__rail-x:hover,
    .ps .ps__rail-y:hover,
    .ps .ps__rail-x:focus,
    .ps .ps__rail-y:focus,
    .ps .ps__rail-x.ps--clicking,
    .ps .ps__rail-y.ps--clicking {
        background-color: transparent;
    }

    .ps__rail-x:hover > .ps__thumb-x,
    .ps__rail-x:focus > .ps__thumb-x,
    .ps__rail-x.ps--clicking .ps__thumb-x {
        background-color: #999;
        height: $scrollbar-active-height;
    }

    .ps__rail-y:hover > .ps__thumb-y,
    .ps__rail-y:focus > .ps__thumb-y,
    .ps__rail-y.ps--clicking .ps__thumb-y {
        background-color: #999;
        width: $scrollbar-active-height;
    }

    .ps__thumb-x,.ps__thumb-y{
        border-radius: 0;
    }
</style>

<style lang="scss" scoped>
    .scroll-bar-wrap {
        width: 100%;
        height: 100%;
        position: relative;
    }
</style>