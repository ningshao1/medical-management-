import icon from '@/img/ht.svg';

const Wrap = () => import('./wrap'),
    List = () => import('./list'),
    Info = () => import('./info');


export default [
    {
        path: 'contract',
        name: 'contract',
        meta: {
            label: '合同管理',
            imgUrl: icon,
            limit: 'con:list'
        },
        redirect: {name: 'contract-list'},
        component: Wrap,
        children: [
            {
                path: 'list',
                name: 'contract-list',
                meta: {
                    label: '合同管理列表',
                    breadcrumbHide: true,
                    limit: 'con:list'
                },
                component: List
            },
            {
                path: 'detail',
                name: 'contract-detail',
                meta: {
                    label: '合同详情',
                    limit: 'con:query'
                },
                component: Info
            },
            {
                path: 'add',
                name: 'contract-add',
                meta: {
                    label: '新增合同',
                    limit: 'con:add'
                },
                component: Info
            },
            {
                path: 'edit',
                name: 'contract-edit',
                meta: {
                    label: '编辑合同',
                    limit: 'con:edit'
                },
                component: Info
            }
        ]
    }
];