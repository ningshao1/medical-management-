import { Modal } from "iview";
export default {
    extends: Modal,
    name: Modal.name,
    props: {
        draggable: {
            default: true
        }
    },
    data() {
        return {
            contentEl: null,
            headerEl: null,
            wrapEl: null,
            positionStore: null
        };
    },
    mounted() {
        //init data
        this.wrapEl = this.$el.querySelector(".ivu-modal-wrap");
        this.contentEl = this.$el.querySelector(".ivu-modal-content");
        this.headerEl = this.$el.querySelector(".ivu-modal-header");
        //init style
        this.contentEl.style.position = "relative";
        this.contentEl.style.top = 0;
        this.contentEl.style.left = 0;
        //init event
        this.wrapEl.addEventListener("mousedown", this.mousedown);
        this.wrapEl.addEventListener("mouseup", this.mouseup);
    },
    methods: {
        mousedown(e) {
            if (!this.draggable) {
                return;
            }
            const { target, button, clientX, clientY } = e;
            if (button !== 0 || !this.headerEl.contains(target)) {
                return;
            }
            this.wrapEl.addEventListener("mousemove", this.mousemove);
            const { left, top } = this.contentEl.style;
            this.positionStore = {
                x: clientX,
                y: clientY,
                left: this.killPX(left),
                top: this.killPX(top)
            };
        },
        mouseup() {
            this.removeEvent();
        },
        removeEvent() {
            this.wrapEl.removeEventListener("mousemove", this.mousemove);
        },
        mousemove(e) {
            const { clientY, clientX } = e;
            const { x, y, left, top } = this.positionStore;
            this.contentEl.style.left = left + (clientX - x) + "px";
            this.contentEl.style.top = top + (clientY - y) + "px";
        },
        killPX(temp) {
            return Number(temp.replace("px", ""));
        }
    },
    beforeDestroy() {}
};
