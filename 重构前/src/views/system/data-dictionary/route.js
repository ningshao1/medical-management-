const dataDictionary = () => import("./data-dictionary.vue"),
    brand = () => import("./brand/brand.vue"),
    faultType=()=>import('./fault-type/index.vue'),
    faultPhenomenon=()=>import('./fault-phenomenon/index.vue'),
    faultProcess=()=>import('./fault-process/index.vue');
export default [
    {
        path: "dataDictionary",
        name: "data-dictionary",
        component: dataDictionary,
        redirect: { name: "brand-management" },
        children: [
            {
                name: "brand-management",
                path: "brandManagement",
                component: brand
            },
            {
                name: "fault-type",
                path: "faultType",
                component: faultType
            },
            {
                name: "fault-phenomenon",
                path: "faultPhenomenon",
                component: faultPhenomenon
            },
            {
                name: "fault-process",
                path: "faultProcess",
                component: faultProcess
            },
        ]
    }
];
