import depreciationImg from './image/折旧管理.png';
import scrapImg from './image/报废管理.png';


const index = () => import('./index.vue'),
    depreciation = () => import('./depreciation/depreciation.vue'),
    scrapList = () => import('./scrap/list.vue'),
    scrapInfo = () => import('./scrap/info.vue'),


    routerView = {render: h => h('router-view')};




export default [
    {
        path: 'depreciation-scrap',
        name: 'depreciation-scrap',
        meta: {
            label: '折旧报废'
        },
        component: index,
        redirect: {name: 'depreciation'},
        children: [
            {
                path: 'depreciation',
                name: 'depreciation',
                meta: {
                    label: '折旧管理',
                    imgUrl: depreciationImg,
                    limit: 'ds:dep'
                },
                component: depreciation
            },
            {
                path: 'scrap',
                name: 'scrap',
                meta: {
                    label: '报废管理',
                    imgUrl: scrapImg
                },
                component: routerView,
                redirect: {name: 'scrap-list'},
                children: [
                    {
                        path: 'list',
                        name: 'scrap-list',
                        meta: {
                            label: '报废管理',
                            breadcrumbHide: true,
                            limit: 'ds:scrap'
                        },
                        component: scrapList
                    },
                    {
                        path: 'apply',
                        name: 'scrap-apply',
                        meta: {
                            label: '申请报废',
                            limit: 'ds:add'
                        },
                        component: scrapInfo
                    },
                    {
                        path: 'details',
                        name: 'scrap-details',
                        meta: {
                            label: '报废信息详情',
                            limit: 'ds:query'
                        },
                        component: scrapInfo
                    }
                ]
            }
        ]
    }
];