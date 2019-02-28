const
    ROUTE_NAME_PREFIX = 'annual-plan',
    ROUTE_LABEL_BASE = '年度计划';


const
    AnnualPlan = () => import('./AnnualPlan'),
    AnnualPlanList = () => import('./AnnualPlanList');
    // AnnualPlan = () => import('./AnnualPlanList'),
export default [
    {
        path: ROUTE_NAME_PREFIX,
        name: ROUTE_NAME_PREFIX,
        meta: {
            label: ROUTE_LABEL_BASE,
        },
        component: AnnualPlan,
        redirect: {name: `${ROUTE_NAME_PREFIX}-list`},
        children: [
            {
                path: 'list',
                name: `${ROUTE_NAME_PREFIX}-list`,
                meta: {
                    label: ROUTE_LABEL_BASE,
                    breadcrumbHide: true,
                },
                component: AnnualPlanList
            },
            {
                path: 'add',
                name: `${ROUTE_NAME_PREFIX}-add`,
                meta: {
                    label: `新增${ROUTE_LABEL_BASE}`,
                    breadcrumbHide: true,
                }
            },
            {
                path: 'edit',
                name: `${ROUTE_NAME_PREFIX}-edit`,
                meta: {
                    label: `编辑${ROUTE_LABEL_BASE}`,
                    breadcrumbHide: true,
                }
            },
            {
                path: 'detail',
                name: `${ROUTE_NAME_PREFIX}-detail`,
                meta: {
                    label: `${ROUTE_LABEL_BASE}详情`,
                    breadcrumbHide: true,
                }
            },
        ]
    }
]