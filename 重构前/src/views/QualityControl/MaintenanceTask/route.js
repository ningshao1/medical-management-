const addOneTemplate = () => import('./addTemplate/addTemplate.vue'); //新增保养模板
const MaintenanceTask = () => import('./Maintenance-task/MaintenanceTask.vue'); //科长保养列表
const OneMaintenanceDetails = () => import('./OneMaintenanceDetails/OneMaintenanceDetails.vue'); ////一级保养任务
const templateList = () => import('./template-list/templateList.vue');//模板列表
const OneTemplateDetails = () => import('./template-list/one-template-details/OneTemplateDetails.vue');
const addTwoTemplate = () => import('./Two-Maintenance/add-two-tpl/addTwoTpl.vue'); //新增保养模板
const TwoTemplateDetails = () => import('./Two-Maintenance/two-tpl-detail/twoTplDetail'); //新增保养模板
const addTask = () => import('./Two-Maintenance/add-task/add-task.vue'); //新增二级保养任务
const TwoTaskDetail = () => import('./Two-Maintenance/Two-task-detail/TwoTaskDetail');
const ThreeMaintenanceDetails = () => import('./three-maintenance/ThreeMaintenanceDetails') //三级保养详情

const MaintenanceFactors = () => import('./Maintenance-factors/MaintenanceFactors') //保养要素
let Temp = true;
if (localStorage.getItem('user_in')) {
    Temp = JSON.parse(localStorage.getItem('user_in')).roles[0].srName;
}

const routerView = {render: h => h('router-view')};


export default [
    // {
    //     path: 'AddTwoMaintainTask',
    //     name: 'AddTwoMaintainTask',
    //     component: addTask,
    //     meta: {
    //         label: '新增二级保养任务'
    //     },
    // },
    //科长保养列表
    {
        path: 'MaintenanceFactors',
        name: 'MaintenanceFactors',
        component: MaintenanceFactors,
        meta: {
            label: '保养要素',
            imgUrl:require("../static/pageTipImg/保养.png"),
            limit: 'pm:maintain:element'
        }
    },
    {
        path: 'MaintenanceTask_',
        name: 'MaintenanceTask_',
        component: routerView,
        redirect: { name: "MaintenanceTask" },
        meta: {
            imgUrl:require("../static/pageTipImg/保养.png"),
            label: '保养任务',
            breadcrumbHide: Temp !== 'CHIEF' //后期需要判断权限
        },
        children: [
            {
                path: 'MaintenanceTask',
                name: 'MaintenanceTask',
                component: MaintenanceTask,
                meta: {
                    imgUrl:require("../static/pageTipImg/保养.png"),
                    label: '保养任务',
                    breadcrumbHide: true
                },
            },
            //一级保养任务
            {
                path: 'OneMaintenance',
                name: 'OneMaintenance',
                component: OneMaintenanceDetails,
                meta: {
                    imgUrl:require("../static/pageTipImg/保养.png"),
                    label: '一级保养任务',
                    limit:'pm:one:task:query'
                },
            },
            //新增二级保养任务
            {
                path: 'AddTwoMaintainTask',
                name: 'AddTwoMaintainTask',
                component: addTask,
                meta: {
                    imgUrl:require("../static/pageTipImg/保养.png"),
                    label: '新增二级保养任务',
                    limit:'pm:two:task:add'
                },
            },
            //新增二级保养任务
            {
                path: 'AllTwoTaskDetail',
                name: 'AllTwoTaskDetail',
                component: addTask,
                meta: {
                    imgUrl:require("../static/pageTipImg/保养.png"),
                    label: '二级保养任务详情',
                    limit:'pm:two:task:query'
                },
            },
            //二级保养任务详情
            {
                path: 'TwoTaskDetail',
                name: 'TwoTaskDetail',
                component: TwoTaskDetail,
                meta: {
                    imgUrl:require("../static/pageTipImg/保养.png"),
                    label: '二级保养任务详情',
                    limit:'pm:two:task:query'
                },
            },
            //三级保养详情
            {

                path: 'ThreeMaintenanceDetails',
                name: 'ThreeMaintenanceDetails',
                component: ThreeMaintenanceDetails,
                meta: {
                    imgUrl:require("../static/pageTipImg/保养.png"),
                    label: '三级保养详情',
                    limit:'pm:three:task:query'
                },
            }
        ]
    },
    //模板列表
    {
        path: 'templateList_',
        name: 'templateList_',
        redirect: { name: 'templateList' },
        component: routerView,
        meta: {
            imgUrl:require("../static/pageTipImg/保养.png"),
            label: '保养模板管理',
            breadcrumbHide: ''
        },
        children: [
            {
                path: 'templateList',
                name: 'templateList',
                component: templateList,
                meta: {
                    imgUrl:require("../static/pageTipImg/保养.png"),
                    label: '保养模板管理',
                    breadcrumbHide: true,
                    limit:'pm:maintain:model'
                }
            },
            //一级保养模板任务
            {
                path: 'OneTemplateDetails',
                name: 'OneTemplateDetails',
                component: OneTemplateDetails,
                meta: {
                    imgUrl:require("../static/pageTipImg/保养.png"),
                    label: '一级保养模板详情',
                    limit:'pm:maintain:model:query'
                },
            },
            //编辑一级模板
            {
                path: 'configOneTemplate',
                name: 'configOneTemplate',
                component: addOneTemplate,
                
                meta: {
                    imgUrl:require("../static/pageTipImg/保养.png"),
                    label: '编辑一级保养模板',
                    limit:'pm:maintain:model:edit'
                }
            },
            //新增一级保养模板
            {
                path: 'addOneTemplate',
                name: 'addOneTemplate',
                component: addOneTemplate,
                meta: {
                    imgUrl:require("../static/pageTipImg/保养.png"),
                    label: '新增一级保养模板',
                    limit:'pm:maintain:model:add'
                }
            },
            //添加二级模板
            {
                path: 'addTwoTemplate',
                name: 'addTwoTemplate',
                component: addTwoTemplate,
                meta: {
                    imgUrl:require("../static/pageTipImg/保养.png"),
                    label: '新增二级保养模板',
                    limit:'pm:maintain:model:add'
                }
            },
            //编辑二级模板
            {
                path: 'configTwoTemplate',
                name: 'configTwoTemplate',
                component: addTwoTemplate,
                meta: {
                    imgUrl:require("../static/pageTipImg/保养.png"),
                    label: '编辑二级保养模板',
                    limit:'pm:maintain:model:edit'
                }
            },
            //二级模板详情
            {
                path: 'TwoTemplateDetails',
                name: 'TwoTemplateDetails',
                component: TwoTemplateDetails,
                meta: {
                    imgUrl:require("../static/pageTipImg/保养.png"),
                    label: '二级保养模板详情',
                    limit:'pm:maintain:model:query'
                }
            },
        ]
    }


];