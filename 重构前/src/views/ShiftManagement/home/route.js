const Home=()=>import('./home.vue');//主页
export default [{
    path:"ShiftManagementHome",
    name:"shift-management-home",
    component:Home,
    meta:{
        label:'交接班管理主页',
        breadcrumbHide:true,
        limit: 'shiftchange:list'
    }
}]