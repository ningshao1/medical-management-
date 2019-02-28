const management = () => import('./management.vue'),
    label = () => import('./label'),
    classify = () => import('./asset-classify'),
    basicInfo = () => import('./basic-info'),
    alloction = () => import('./form-alloction'),
    doctor = () => import('./doctor-management'),
    user = () => import('./user-management');
export default [{
    path: '/system',
    name: 'system',
    component: management,
    meta: {
        label: '系统管理'
    },
    children: [{
            path: 'label',
            name: 'label',
            component: label,
            meta: {
                label: '标签管理'
            }
        },
        {
            path: 'classify',
            name: 'classify',
            component: classify,
            meta: {
                label: '设备分类管理'
            }
        }, {
            path: 'formAlloction',
            name: 'formAlloction',
            component: alloction,
            meta: {
                label: '报单分配'
            }
        }, {
            path: 'doctorManagement',
            name: 'doctorManagement',
            component: doctor,
            meta: {
                label: '医生关联管理'
            }
        }, {
            path: 'userManagement',
            name: 'userManagement',
            component: user,
            meta: {
                label: '用户管理'
            }
        }, {
            path: 'basicInfo',
            name: 'basicInfo',
            component: basicInfo,
            meta: {
                label: '基础信息'
            }
        }
    ],

}]