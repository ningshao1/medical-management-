const shiftDetail=()=>import('../handover/handover.vue');
export default [{
    path:'shiftDetail',
    name:'shiftDetail',
    component:shiftDetail,
    meta:{
        label:'交接班详情',
        limit: 'shiftchange:list',
        breadcrumbHide:false
    }
}]