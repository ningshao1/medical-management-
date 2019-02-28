
import * as foo  from './index.js';
const {Message,alert,confirm,silentConfirm, Tabs, TabPane,...components}=foo;
const ElementUI = {
    // ...components,
    // Message,
    // alert,
    // confirm,
    install(Vue) {
        Object.values(components).forEach(component => {
            Vue.component(component.name, component);
        });
        Vue.prototype.$message = Message;
        Vue.prototype.$alert = alert;
        Vue.prototype.$confirm = confirm;
        Vue.prototype.$silentConfirm = silentConfirm;
    }
};
export default ElementUI;
