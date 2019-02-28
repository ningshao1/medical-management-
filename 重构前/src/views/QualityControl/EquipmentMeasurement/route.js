const normalEM = () => import("./normalEM/normalEM"),
    lowValueEM = () => import("./lowValueEM/lowValueEM"),
    EMDetail = () => import("./EMDetail/EMDetail"),
    configEMDetail = () => import("./EMDetail/configEMDetail");

// const routerView = {template:'<router-view />'};
// const routerView = { render: h => h("router-view") };
const routerView = {
    render: h => {
        return h("keep-alive", {
            props:{
                include:['normal-EM','low-value-EM']
            }
        }, [h("router-view")]);
    }
};
let route = [
    {
        path: "EquipmentMeasurement",
        name: "equipment-measurement",
        component: routerView,
        redirect: { name: "normal-EM" },
        meta: {
            label: "设备计量",
            breadcrumbHide: true,
            imgUrl: require("../static/pageTipImg/设备计量.png")
        },
        children: [
            {
                path: "normal",
                component: routerView,
                redirect: { name: "normal-EM" },
                meta: {
                    label: "正常设备计量",
                    imgUrl: require("../static/pageTipImg/设备计量.png"),
                    limit: "pm:measurement"
                },
                children: [
                    {
                        path: "normalEM",
                        name: "normal-EM",
                        component: normalEM,
                        meta: {
                            label: "正常设备计量",
                            breadcrumbHide: true,
                            imgUrl: require("../static/pageTipImg/设备计量.png"),
                            limit: "pm:measurement"
                        }
                    },
                    {
                        path: "EMDetail",
                        name: "normalEM-detail",
                        component: EMDetail,
                        meta: {
                            label: "设备计量详情",
                            nextPage: "config-EM-detail-normal",
                            imgUrl: require("../static/pageTipImg/设备计量.png"),
                            limit: "pm:adverseevent:query"
                        }
                    },
                    {
                        path: "configEMDetail",
                        name: "config-EM-detail-normal",
                        component: configEMDetail,
                        meta: {
                            label: "修改计量详情",
                            imgUrl: require("../static/pageTipImg/设备计量.png")
                        }
                    }
                ]
            },
            {
                path: "low",
                component: routerView,
                redirect: { name: "low-value-EM" },
                meta: {
                    label: "低值设备计量",
                    imgUrl: require("../static/pageTipImg/设备计量.png"),
                    limit: "pm:lowmeasurement"
                },
                children: [
                    {
                        path: "lowValueEM",
                        name: "low-value-EM",
                        component: lowValueEM,
                        meta: {
                            label: "低值设备计量",
                            breadcrumbHide: true,
                            imgUrl: require("../static/pageTipImg/设备计量.png"),
                            limit: "pm:lowmeasurement"
                        }
                    },
                    {
                        path: "EMDetail",
                        name: "lowEM-detail",
                        component: EMDetail,
                        meta: {
                            label: "设备计量详情",
                            nextPage: "config-EM-detail-low",
                            imgUrl: require("../static/pageTipImg/设备计量.png"),
                            limit: "pm:lowmeasurement:query"
                        }
                    },
                    {
                        path: "addEMLow",
                        name: "add-EM-low",
                        component: configEMDetail,
                        meta: {
                            label: "新增低值计量设备",
                            page: "add",
                            imgUrl: require("../static/pageTipImg/设备计量.png"),
                            limit: "pm:lowmeasurement:add"
                        }
                    }
                ]
            }
        ]
    }
];
export default route;
