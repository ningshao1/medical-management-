import analysisDetails from './analysis-details/index'; 
import comprehensiveAnalysis from './comprehensive-analysis/index'; 
const tabPanes=[
    {
        name:'comprehensive-analysis',
        label:'综合分析',
        component:comprehensiveAnalysis
    },
    {
        name:'analysis-details',
        label:'分析明细',
        component:analysisDetails
    },
];
export default tabPanes;