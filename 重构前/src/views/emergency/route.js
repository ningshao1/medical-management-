import icon from '@/img/应急物资调用.png';

const Index = () => import("./index"),
    List = () => import("./list"),
    detail = () => import("./detail");

export default [
    {
        path: 'emergency',
        name: 'emergency',
        meta: {
            label: '应急物资调用表',
            imgUrl: icon,
        },
        redirect: {name: 'emergency-list'},
        component: Index,
        children: [
            {
                path: 'emergency-list',
                name: 'emergency-list',
                meta: {
                    label: '应急物资调用表',
                    breadcrumbHide: true
                },
                component: List
            },
            {
                path: "emergency-detail/:id",
                name: "emergency-detail",
                meta: {
                    label: "应急物资调用详情"
                },
                component: detail
            }
        ]
    }
];