const index=()=>import('./index');
const Employee=()=>import('./Employee');
const Chief=()=>import('./Chief');
import adverseEvent from '../adverseEvent/route.js';
import InspectionTasks from '../InspectionTasks/route.js';
import MaintenanceTask from '../MaintenanceTask/route.js';
import EquipmentMeasurement from '../EquipmentMeasurement/route.js';


let route = [{
    path: '/QShome',
    component: index,
    name: 'QS-home',
    meta: {
        label: '质量控制',
        limit:'pm:list'
    },
    children: [
        ...adverseEvent,
        ...InspectionTasks,
        ...MaintenanceTask,
        ...EquipmentMeasurement,
        {
            path:'Doctor',
            component:Employee,
            name:"QS-doctor-home",
            meta:{
                label:"医生",
                breadcrumbHide:true,
                limit:'pm:list'
            }
        },
        {
            path:'Engineer',
            component:Employee,
            name:"QS-engineer-home",
            meta:{
                label:"工程师",
                breadcrumbHide:true,
                limit:'pm:list'
            }
        },
        {
            path:'Chief',
            component:Chief,
            name:"QS-chief-home",
            meta:{
                label:"科长",
                breadcrumbHide:true,
                limit:'pm:list'
            }
        }
    ]
}];
export default route;