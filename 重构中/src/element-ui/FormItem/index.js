import FormItem from 'element-ui/lib/form-item';
import './style.scss';

export default {
    extends: FormItem,
    name: FormItem.name,
    watch: {
        validateState(value) {
            this.validateState = value === 'success' ? '' : value;
        }
    }
};

