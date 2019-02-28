const inspectionElement = () => import('./inspection-element/inspection-element.vue'),
    inspectionTaskList = () => import('./inspection-tasks/inspection-task-list.vue'),
    inspectionTaskAddwithDetails = () => import('./inspection-tasks/inspection-task-add.vue'),
    inspectionTaskStageDetails = () => import('./inspection-tasks/inspection-task-stage-details.vue'),
    inspectionTemplateAdd = () => import('./inspection-template/inspection-template-add.vue'),
    inspectionTemplateDetails = () => import('./inspection-template/inspection-template-details.vue'),
    inspectionTemplateList = () => import('./inspection-template/inspection-template-list.vue'),


    routerView = {render: h => h('router-view')};

export default [
    {
        path: 'inspectElManage',
        name: 'inspection-element',
        meta: {
            label: '巡检要素管理',
            imgUrl:require("../static/pageTipImg/巡检.png"),
            limit: 'pm:inspection:element',
        },
        component: inspectionElement
    },
    {
        path: 'inspectTasks',
        name: 'inspection-task',
        meta: {
            label: '巡检任务',
            imgUrl:require("../static/pageTipImg/巡检.png")
        },
        component: routerView,
        redirect: {name: 'inspection-task-list'},
        children: [
            {
                path: 'list',
                name: 'inspection-task-list',
                meta: {
                    label: '巡检任务列表',
                    breadcrumbHide: true,
                    imgUrl:require("../static/pageTipImg/巡检.png"),
                    limit: 'pm:inspection:task'
                },
                component: inspectionTaskList
            },
            {
                path: 'add',
                name: 'inspection-task-add',
                meta: {
                    label: '新增巡检任务',
                    imgUrl:require("../static/pageTipImg/巡检.png"),
                    limit: 'pm:inspection:task:add'
                },
                component: inspectionTaskAddwithDetails
            },
            {
                path: 'details',
                name: 'inspection-task-details',
                meta: {
                    imgUrl:require("../static/pageTipImg/巡检.png"),
                    label: '巡检任务详情',
                    limit: 'pm:inspection:task:query'
                },
                component: inspectionTaskAddwithDetails
            },
            {
                path: 'stage-details',
                name: 'inspection-task-stage-details',
                meta: {
                    imgUrl:require("../static/pageTipImg/巡检.png"),
                    label: '巡检任务日志',
                    limit: 'pm:inspection:task:query'
                },
                component: inspectionTaskStageDetails
            }
        ]
    },
    {
        path: 'inspectTem',
        name: 'inspection-template',
        meta: {
            imgUrl:require("../static/pageTipImg/巡检.png"),
            label: '巡检模板'
        },
        redirect: {name: 'inspection-template-list'},
        component: routerView,
        children: [
            {
                path: 'list',
                name: 'inspection-template-list',
                meta: {
                    imgUrl:require("../static/pageTipImg/巡检.png"),
                    label: '巡检模板列表',
                    breadcrumbHide: true,
                    limit: 'pm:inspection:model'
                },
                component: inspectionTemplateList
            },
            {
                path: 'add',
                name: 'inspection-template-add',
                meta: {
                    imgUrl:require("../static/pageTipImg/巡检.png"),
                    label: '新增巡检模板',
                    limit: 'pm:inspection:model:add'
                },
                component: inspectionTemplateAdd
            },
            {
                path: 'edit',
                name: 'inspection-template-edit',
                meta: {
                    imgUrl:require("../static/pageTipImg/巡检.png"),
                    label: '编辑巡检模板',
                    limit: 'pm:inspection:model:edit'
                },
                component: inspectionTemplateAdd
            },
            {
                path: 'details',
                name: 'inspection-template-details',
                meta: {
                    imgUrl:require("../static/pageTipImg/巡检.png"),
                    label: '巡检模板详情',
                    limit: 'pm:inspection:model:query'
                },
                component: inspectionTemplateDetails
            },
        ]
    }
];