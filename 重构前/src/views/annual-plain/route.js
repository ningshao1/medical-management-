const index = () => import(/*webpackChunkName: "annual-plain-index"*/ './index'),
    list = () => import(/*webpackChunkName: "annual-plain-list"*/ './list'),
    addAnnual = () => import('./add-annual/index'),
    addAnnualFifty = () => import(/*webpackChunkName: "annual-fifty"*/ './add-annual-fifty'),
    //五十万一下详情
    detailAnnual = () => import('./add-annual/detail-annual/index.vue');

export default [
    {
        path: 'annual-plain',
        name: 'annual-plain',
        meta: {
            label: '年度计划',
            limit:'annual:list'

        },
        component: index,
        redirect: {name: 'annual-plain-list'},
        // redirect: {name: 'add-annual-fifty'},
        children: [
            {
                path: 'list',
                name: 'annual-plain-list',
                meta: {
                    label: '年度计划',
                    breadcrumbHide: true,
                    limit:'annual:list'
                },
                component: list
            },
            {
                path: 'add-annual',
                name: 'add-annual',
                meta: {
                    label: '添加年度计划',
                },
                component: addAnnual
            },
            {
                path: 'short-annual',
                name: 'short-annual',
                meta: {
                    label: '添加临时计划',
                },
                component: addAnnual
            },
            {
                path: 'detail-annual',
                name: 'detail-annual',
                meta: {
                    label: '年度计划详情',
                },
                component: detailAnnual
            },



            {
                path: 'addAnnualfifty',
                name: 'add-annual-fifty',
                meta: {
                    label: '新增计划',
                },
                component: addAnnualFifty
            },
            // {
            //     path: 'addAnnualTwoHundred',
            //     name: 'add-annual-two-hundred',
            //     meta: {
            //         label: '新增计划',
            //     },
            //     component: addAnnualFifty
            // },
            {
                path: 'fiftyAnnualDetails',
                name: 'fifty-annual-details',
                meta: {
                    label: '年度计划详情'
                },
                component: addAnnualFifty
            },
            // {
            //     path: 'twoHundredAnnualDetails',
            //     name: 'two-hundred-annual-details',
            //     meta: {
            //         label: '年度计划详情'
            //     },
            //     component: heightAnnualDetails
            // },
        ]
    }
];