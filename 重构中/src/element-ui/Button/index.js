// import { Button } from 'element-ui';
import Vue from 'vue';
import Button from 'element-ui/lib/button';
// 防抖函数


function handleClick(event) {
    if (this.jump) {
        typeof this.jump === 'string' ?
            this.$router.push({ name: this.jump }) :
            this.$router.push(this.jump);
    }
    this.$emit('click', event)
}
// 导出新组件
export default {
    extends: Button,
    name: Button.name,
    props: {
        debounce: {
            type: Boolean,
            default: () => {
                return true;
            }
        },
        delay: {
            type: Number,
            default: () => {
                return 200;
            }
        },
        type: {
            type: String,
            default: "primary"
        },
        jump: {
            type: [String, Object]
        }
    },
    data() {
        return {
            click: 0
        }
    },
    methods: {
        handleClick(event) {
            if (!this.debounce) {
                handleClick.call(this, event);
                return
            }
            let that = this;

            this.debounceHandle(handleClick, this.delay, that, event, this.click)
        },
        debounceHandle(func, delay, context, event, clicks) {
            if (clicks === 0) {
                func.call(context, event);
                this.click++;
            }
            else {
                clearTimeout(func.timer)
                func.timer = setTimeout(function () {
                    func.call(context, event);
                }, delay)
            }

        }
    },

    install() {
        Vue.component(this.name, this)
    }
}