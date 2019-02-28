const createBtnHandler = type => async function () {
    const {[type]: callback} = this;
    if (typeof callback === 'function') {
        const result = callback();
        if (result instanceof Promise) {
            const loadingField = `${type}Loading`;
            this[loadingField] = true;
            try {
                await result;
            } finally {
                this[loadingField] = false;
            }
        }
    }
    this.visible = false;
    this.$emit('action', type);
};


export default {
    props: {
        title: {
            type: [String, Function],
            default: '提示'
        },
        content: {
            type: [String, Function]
        },
        okText: {
            type: String,
            default: '确认'
        },
        cancelText: {
            type: String,
            default: '取消'
        },
        ok: {
            type: [Function, Boolean],
            default: undefined
        },
        cancel: {
            type: [Function, Boolean],
            default: undefined
        }
    },

    data() {
        return {
            visible: false,
            okLoading: false,
            cancelLoading: false
        };
    },
    computed: {
        dialogTitle() {
            return this.transformMaybeRender(this.title);
        },
        dialogContent() {
            return this.transformMaybeRender(this.content);
        },
        okDisabled() {
            return this.cancelLoading;
        },
        cancelDisabled() {
            return this.okLoading;
        },
        btnLoading() {
            return this.okLoading || this.cancelLoading;
        },

        okBtnVisible() {
            return this.ok !== false;
        },
        cancelBtnVisible() {
            return this.cancel !== false;
        },
        btnsVisible() {
            return this.okBtnVisible || this.cancelBtnVisible;
        }
    },

    mounted() {
        this.visible = true;
    },

    destroyed() {
        document.body.removeChild(this.$el);
    },

    methods: {
        transformMaybeRender(data) {
            return typeof data === 'function' ? data.call(this, this.$createElement) : data
        },
        updateVisible() {
            if (! this.btnLoading) {
                this.cancelHandler();
            }
            // this.visible = value;
        },
        closed() {
            this.$destroy();
        },
        okHandler: createBtnHandler('ok'),
        cancelHandler: createBtnHandler('cancel')
    },
};