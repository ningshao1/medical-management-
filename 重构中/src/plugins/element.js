import Vue from "vue";
import { Button, Message, Tree,Autocomplete,Switch,Card } from "@el";
import {
    Checkbox,
    Select,
    Option,
    Input,
    Radio,
    RadioGroup,
    RadioButton,
    Dialog,
} from "element-ui";
const components = [Button,RadioGroup,RadioButton, Checkbox, Select, Option, Input, Radio,Tree,Autocomplete,Dialog,Card,Switch];
components.forEach(component => {
    Vue.use(component);
});
Vue.prototype.$message = Message;