const ShiftManagement=()=>import('./index.vue');//框架
import Home from "./home/route.js"
import handover from "./handover/route.js"
import shiftDetail from "./shiftDetail/route.js"
import successionOrders from "./successionOrders/route.js"

const routerView={render:h=>h('router-view')};
const route=[{
    path:'ShiftManagement',
    name:'shift-management',
    component:ShiftManagement,
    redirect:{name:'shift-management-home'},
    meta:{
        label: '交接班管理',
        breadcrumbHide:false,
        limit: 'shiftchange:list'
    },
    children:[
        ...Home,
        ...handover,
        ...shiftDetail,
        ...successionOrders
    ]
}];
export default route