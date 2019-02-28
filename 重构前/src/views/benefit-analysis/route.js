const benefitAnalysisWrap=()=>import('./index.vue');
import assetBenefitAnalysis from './asset-benefit-analysis/route';
import doctorPRAnalysis from "./doctor-pr-analysis/route";
const equipmentMonitoring=()=>import("./equipment-monitoring");

const route=[{
    path:"benefitAnalysisWrap",
    name:'benefit-analysis-wrap',
    meta:{
        label: '效益分析',
        breadcrumbHide:true,
    },
    component:benefitAnalysisWrap,
    children:[
        ...assetBenefitAnalysis,
        ...doctorPRAnalysis,
        {
            path:"equipmentMonitoring",
            name:'equipment-monitoring',
            meta:{
                label: '设备监控',
                breadcrumbHide:false,
            },
            component:equipmentMonitoring,
        }
    ]
}]
export default route;