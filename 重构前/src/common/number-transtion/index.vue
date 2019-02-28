<template>
    <span :style="styles">
        {{endNumber}}
    </span>
</template>
<script>
export default {
    name: "number-animate",
    props: {
        start: {
            default: 0,
            type: Number
        },
        end: {
            type: [Number, String],
            required: true
        },
        styles: {
            default() {
                return {};
            },
            type: Object
        },
        time: {
            default: 2500,
            type: Number
        }
    },
    data() {
        return {
            endNumber: this.start,
            timer: ""
        };
    },
    methods: {
        transtion() {
            let time = (this.end - this.start) / this.time;
            let start = this.start;
            let end = this.end;
            let timer;
            let animate = () => {
                if (end < start) {
                    this.endNumber = this.end;
                    cancelAnimationFrame(timer);
                } else {
                    start = start + Math.ceil(time * 50);
                    this.endNumber = start;
                    timer = requestAnimationFrame(animate);
                    this.timer = timer;
                }
            };
            timer = requestAnimationFrame(animate);
        }
    },
    watch: {
        end: {
            handler(value) {
                if (value > 0) this.transtion();
            },
            immediate: true
        }
    },
    destroyed() {
        cancelAnimationFrame(this.timer);
    }
};
</script>
<style lang="less" scoped>
span {
    cursor: pointer;
    &:active {
        opacity: 0.6;
    }
}
</style>
