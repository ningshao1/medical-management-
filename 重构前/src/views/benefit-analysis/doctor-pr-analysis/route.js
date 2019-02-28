const doctorPRAnalysis=()=>import("./doctor-pr-analysis");
const diagnosticHistory=()=>import("./diagnostic-history");
const route=[
    {
        path:'doctorPRAnalysisWrap',
        name:"doctor-pr-analysis-wrap",
        meta:{
            label:'医生阳性率分析',
            breadcrumbHide:false
        },
        redirect: { name: "doctor-pr-analysis" },
        component: { render: h => h('router-view') },
        children:[

            {
                path:'doctorPRAnalysis',
                name:"doctor-pr-analysis",
                meta:{
                    label:'医生阳性率分析',
                    breadcrumbHide:true
                },
                component:doctorPRAnalysis
            },
            {
                path:"diagnosticHistory",
                name:'diagnostic-history',
                meta:{
                    label: '诊断历史',
                    breadcrumbHide:false,
                },
                component:diagnosticHistory
            }
        ]
    }
];
export default route;