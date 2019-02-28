const borrowDetail = () => import('./borrow-detail.vue');
export default [{
    path: 'borrowZ',
    component: { render: h => h('router-view') },
    redirect: { name: 'asset-borrow' },
    meta: {
        label: "设备借用列表"
    },
    children: [{
        path: 'borrowDetail',
        name: 'borrow-detail',
        component: borrowDetail,
        meta: {
            label: '借入科室设备归还',
            imgUrl: require('../../image/borrow-list.png')
        }
    }, {
        path: 'borrowAccept',
        name: 'borrow-accept',
        component: borrowDetail,
        meta: {
            label: '借入科室设备验收',
            imgUrl: require('../../image/borrow-list.png')
        }
    }]

}]