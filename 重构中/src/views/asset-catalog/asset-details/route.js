export default [
        {
            path:'AssetDetails/:id',
            name:'asset-details',
            component:()=> import('./asset-details'),
            redirect:{name:"asset-base-details"},
            meta:{
                breadcrumbHide:true,

                label:"资产卡片"
            },
            children:[
                {
                    path:'AssetBaseDetails',
                    name:'asset-base-details',
                    component:()=>import ("./cards/base-details"),
                    meta:{
                        // breadcrumbHide:true,
                        label:"设备详情",
                        icon:'kld-icon-shebeixiangqing'
                    },
                },
                
                {
                    path:'AssetPurchaseRecord',
                    name:'asset-purchase-record',
                    component:()=>import ("./cards/purchase-record"),
                    meta:{
                        // breadcrumbHide:true,
                        label:"采购记录",
                        icon:'kld-icon-caigoujihua'
                    },
                },
                {
                    path:'InstallationAcceptanceRecord',
                    name:'installation-acceptance-record',
                    component:()=>import ("./cards/installation-acceptance-record"),
                    meta:{
                        // breadcrumbHide:true,
                        label:"验收记录",
                        icon:'kld-icon-yanshoujilu'
                    },
                },
                {
                    path:'AssetMaintenanceRecord',
                    name:'asset-maintenance-record',
                    component:()=>import ("./cards/asset-maintenance-record/"),
                    meta:{
                        // breadcrumbHide:true,
                        label:"维修记录",
                        icon:'kld-icon-zhejiuxinxi'
                    },
                },
                {
                    path:'InspectionRecord',
                    name:'inspection-record',
                    component:()=>import ("./cards/inspection-record"),
                    meta:{
                        // breadcrumbHide:true,
                        label:"巡检记录",
                        icon:'kld-icon-xunjianjilu'
                    },
                },
                {
                    path:'AssetDepreciationInformation',
                    name:'asset-depreciation-information',
                    component:()=>import ("./cards/asset-depreciation-information"),
                    meta:{
                        // breadcrumbHide:true,
                        label:"折旧信息",
                        icon:'kld-icon-zhejiuxinxi'
                    },
                },
                {
                    path:'MaintenanceRecord',
                    name:'maintenance-record',
                    component:()=>import ("./cards/maintenance-record"),
                    meta:{
                        // breadcrumbHide:true,
                        label:"保养记录",
                        icon:'kld-icon-baoyangjilu'
                    },
                },
                {
                    path:'MeasurementRecord',
                    name:'measurement-record',
                    component:()=>import ("./cards/measurement-record"),
                    meta:{
                        // breadcrumbHide:true,
                        label:"计量记录",
                        icon:'kld-icon-jiliangjilu'
                    },
                },
                {
                    path:'AdverseEventRecord',
                    name:'adverse-event-record',
                    component:()=>import ("./cards/adverse-event-record"),
                    meta:{
                        // breadcrumbHide:true,
                        label:"不良事件",
                        icon:'kld-icon-RFIDbiaoqianguanli'
                    },
                },
                {
                    path:'EquipmentAdjustmentRecord',
                    name:'equipment-adjustment-record',
                    component:()=>import ("./cards/equipment-adjustment-record"),
                    meta:{
                        // breadcrumbHide:true,
                        label:"设备调剂",
                        icon:'kld-icon-shebeitiaoji'
                    },
                }
            ]
        },
]