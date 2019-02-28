import DatePicker from "./date-picker";
import Select from './select';
import Modal from './modal';
const components = {
    DatePicker,
    Select,
    iSelect:Select,
    Modal
};

/**
 * 
 * @修复原生组件bug
 */
export default {
    install(Vue) {
        Object.keys(components).forEach(componentName => {
            Vue.component(componentName, components[componentName]);
        });
    }
};
