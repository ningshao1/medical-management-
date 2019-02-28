const List = () => import('./list'),
    Detail = () => import('./detail');

export default [
    {
        path: 'large-equipment',
        name: 'large-equipment',
        meta: {
            label: '大型医疗设备'
        },
        redirect: {name: 'large-equipment-list'},
        component: {render: h => h('router-view')},
        children: [
            {
                path: 'list',
                name: 'large-equipment-list',
                meta: {
                    label: '大型医疗设备'
                },
                component: List
            },
            {
                path: 'detail',
                name: 'large-equipment-detail',
                meta: {
                    label: '大型医疗设备监测详情'
                },
                component: Detail
            }
        ]
    }
]