import Confirm from "./Confirm.vue";
const createBtnHandler = type =>
    async function() {
        let error,
            result,
            smooth = true;
        const { [type]: callback } = this;
        if (typeof callback === "function") {
            try {
                result = callback();
            } catch (e) {
                error = e;
                smooth = false;
            }

            if (result instanceof Promise && smooth) {
                const loadingField = `${type}Loading`;
                this[loadingField] = true;
                try {
                    result = await result;
                } catch (e) {
                    error = e;
                } finally {
                    this[loadingField] = false;
                }
            }
        }
        this.visible = false;
        this.$emit("action", error, type, result);
    };
export default {
    name: "kld-silent-confirm",
    extends: Confirm,
    methods: {
        closed() {
            this.$destroy();
        },
        okHandler: createBtnHandler("ok"),
        cancelHandler: createBtnHandler("cancel")
    }
};
