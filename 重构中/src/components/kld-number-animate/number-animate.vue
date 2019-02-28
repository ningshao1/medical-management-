<template>
    <span :style="styles"
          @click="clickHandler">
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
        },
        JumpOption: {
            type: [Object, String],
            default: null
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
        },
        clickHandler(event) {
            this.$emit("click", event);
            if (this.JumpOption === null) return;
            if (typeof this.JumpOption === "string")
                this.$router.push({ name: this.JumpOption });
            else if (typeof this.JumpOption === "object")
                this.$router.push(this.JumpOption);
        }
    },
    watch: {
        end: {
            handler(value) {
                if (typeof value === "number" || typeof value === "string")
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
