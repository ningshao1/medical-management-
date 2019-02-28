const dataStatistics = () => import("./index.vue");
const serviceLog = () => import("./service-log/index.vue");
const rateCharts = () => import("./rate-charts");
const measurementStatistics = () => import('./measurement-statistics');
const InspectCount = () => import("./inspect-count");
const MaintainCount = () => import("./maintain-count");
const poorStatistics = () => import("./poor-statistics/index.vue");
export default [{
    path: "data-statistics",
    name: "data-statistics",
    component: dataStatistics,
    meta: {
        label: "数据统计"
    },
    children: [{
            path: "QC-statistics",
            name: "QC-statistics",
            component: { render: h => h("router-view") },
            meta: {
                label: "质控数据统计",
                breadcrumbHide: true,
                imgUrl: require('../image/质控数据统计.png')
            },
            children: [{
                    path: 'inspect-count',
                    name: 'inspect-count',
                    meta: {
                        label: '巡检统计',
                        imgUrl: require("../QualityControl/static/img/巡检.png")
                    },
                    component: InspectCount
                },
                {
                    path: 'maintain-count',
                    name: 'maintain-count',
                    meta: {
                        label: '保养统计',
                        imgUrl: require("../QualityControl/static/img/保养.png")
                    },
                    component: MaintainCount
                },
                {
                    path: "measurementStatistics",
                    name: "measurement-statistics",
                    component: measurementStatistics,
                    meta: {
                        label: "计量统计",
                        imgUrl: require("../QualityControl/static/img/设备计量.png")
                    }
                },
                {
                    path: 'poor-statistics',
                    name: "poor-statistics",
                    component: poorStatistics,
                    meta: {
                        label: '不良事件统计',
                        imgUrl: require("../QualityControl/static/img/不良事件.png")
                    }
                }
            ]
        },
        {
            path: "maintenance-data",
            name: "maintenance-data",
            component: { render: h => h("router-view") },
            meta: {
                label: "维修记录统计",
                breadcrumbHide: true,
                imgUrl: require('../image/维修数据统计.png')
            },
            children: [{
                    path: "service-log",
                    name: "service-log",
                    component: serviceLog,
                    meta: {
                        label: "维修记录",
                        imgUrl: require('../image/维修数据统计.png')
                    }
                },
                {
                    path: "rateCharts",
                    name: "rate-charts",
                    component: rateCharts,
                    meta: {
                        label: "生命支持类设备维修率统计",
                        imgUrl: require('../../views/image/生命支持类设备.png')
                    }
                }
            ]
        },
    ]
}];