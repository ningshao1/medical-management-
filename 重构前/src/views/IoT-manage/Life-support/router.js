const index = () => import('./index.vue'),
    lifeAll = () => import('./life-all/life-all.vue'),
    departmentDetail = () => import('./department-detail/dep-detail.vue'),
    assetDetail = () => import('./asset-detail/asset-detail.vue');
export default [{
        name: 'life-support',
        path: 'life-support',
        component: index,
        redirect: { name: 'life-all' },
        meta: {
            label: '生命支持类设备',
            breadcrumbHide: true
        },
        children: [{
            name: 'life-all',
            path: 'life-all',
            component: lifeAll,
            meta: {
                label: '生命支持类设备',
            }
        }, {
            name: 'department-detail',
            path: 'department-detail/:id/:name',
            component: departmentDetail,
            meta: {
                label: '生命支持类设备'
            }
        }, {
            name: 'asset-detail',
            path: 'asset-detail/:id',
            component: assetDetail,
            meta: {
                label: '生命支持类设备详情'
            }
        }]
    },

]