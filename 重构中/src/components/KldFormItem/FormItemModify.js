import {FormItem} from '@el';

export default {
    extends: FormItem,
    name: FormItem.name,
    computed: {
        labelStyle() {
            const ret = {};
            const labelWidth = this.labelWidth || this.form.labelWidth;
            if (labelWidth) {
                ret.width = labelWidth;
            }
            return ret;
        }
    }
}