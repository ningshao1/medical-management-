const  benefitAnalysisDetail=()=>import('./benefit-analysis/index.vue'),
    benefitAnalysisHome=()=>import('./home');

const route=[
    {
        path:'benefitAnalysisHomeWrap',
        name:"benefit-analysis-home-wrap",
        meta:{
            label:'设备效益分析',
            breadcrumbHide:false
        },
        redirect: { name: "benefit-analysis-home" },
        component: { render: h => h('router-view') },
        children:[

            {
                path:'benefitAnalysisHome',
                name:"benefit-analysis-home",
                meta:{
                    label:'设备效益分析',
                    breadcrumbHide:true
                },
                component:benefitAnalysisHome
            },
            {
                path:"benefitAnalysisDetail",
                name:'benefit-analysis-detail',
                meta:{
                    label: '效益分析详情',
                    breadcrumbHide:false,
                },
                component:benefitAnalysisDetail
            }
        ]
    }
]
export default route;