import DatePicker from 'element-ui/lib/date-picker';
import './style.scss';
export default {
    extends: DatePicker,
    name: DatePicker.name,
    props: {
        valueFormat: {
            type: String,
            default: 'yyyy-MM-dd'
        }
    }
};