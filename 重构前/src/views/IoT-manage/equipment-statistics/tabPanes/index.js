import lifeSupport from "./life-support.vue";
import largeMedical from "./large-medical.vue";
export default [
    {
        component: lifeSupport,
        label: "生命支持类设备",
        type: 3
    },
    {
        component: largeMedical,
        label: "大型医疗设备",
        type: 4
    }
];
