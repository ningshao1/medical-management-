const
    Contract = () => import('./Contract'),
    ContractList = () => import('./ContractList'),
    ContractEdit = () => import('./ContractEdit'),
    ContractDetail = () => import('./ContractDetail'),
    ContractAdd = () => import('./ContractAdd');

export default [
    {
        path: 'contract',
        name: 'contract',
        meta: {
            label: '合同管理'
        },
        redirect: {name: 'contract-list'},
        component: Contract,
        children: [
            {
                path: 'list',
                name: 'contract-list',
                meta: {
                    label: '合同管理',
                    breadcrumbHide: true
                },
                component: ContractList
            },
            {
                path: 'add',
                name: 'contract-add',
                meta: {
                    label: '新增合同',
                },
                component: ContractAdd
            },
            {
                path: 'edit',
                name: 'contract-edit',
                meta: {
                    label: '编辑合同',
                },
                component: ContractEdit
            },
            {
                path: 'detail',
                name: 'contract-detail',
                meta: {
                    label: '合同详情',
                },
                component: ContractDetail
            },
        ]
    }
];