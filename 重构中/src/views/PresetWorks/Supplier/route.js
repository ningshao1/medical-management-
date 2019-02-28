const
    Supplier = () => import('./Supplier'),
    SupplierList = () => import('./SupplierList'),
    SupplierAdd = () => import('./SupplierAdd'),
    SupplierEdit = () => import('./SupplierEdit'),
    SupplierDetail = () => import('./SupplierDetail');

export default [
    {
        path: 'supplier',
        name: 'supplier',
        meta: {
            label: '供应商管理',

        },
        component: Supplier,
        redirect: {name: 'supplier-list'},
        children: [
            {
                path: 'list',
                name: 'supplier-list',
                meta: {
                    label: '供应商管理',
                    breadcrumbHide: true
                },
                component: SupplierList
            },
            {
                path: 'add',
                name: 'supplier-add',
                meta: {
                    label: '新增供应商',
                },
                component: SupplierAdd
            },
            {
                path: 'edit',
                name: 'supplier-edit',
                meta: {
                    label: '编辑供应商',
                },
                component: SupplierEdit
            },
            {
                path: 'detail',
                name: 'supplier-detail',
                meta: {
                    label: '供应商详情',
                },
                component: SupplierDetail
            },
        ]
    }
];