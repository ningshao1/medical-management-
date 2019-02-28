export default [
    {
        path: "equipmentStatistics",
        name: "equipment-statistics",
        meta: {
            label: "物联设备统计表",
            breadcrumbHide: false
        },
        component: () => import("./index.vue")
    }
];
