import {isComponentInstance} from '@/utils';

export default {
    inject: {
        formItem: {
            from: 'elFormItem',
            default: null
        }
    },
    methods: {
        emitFormItemChange(value) {
            if (isComponentInstance(this.formItem)) {
                this.formItem.$emit('el.form.change', value);
            }
        },
        emitFormItemBlur(value) {
            if (isComponentInstance(this.formItem)) {
                this.formItem.$emit('el.form.blur', value);
            }
        }
    }
}