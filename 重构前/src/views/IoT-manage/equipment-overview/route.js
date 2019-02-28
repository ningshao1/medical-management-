export default [
    {
        path: "equipmentOverview",
        name: "equipment-overview",
        meta: {
            label: "物联医疗设备总览",
            breadcrumbHide: false
        },
        component: () => import("./index.vue")
    }
];
