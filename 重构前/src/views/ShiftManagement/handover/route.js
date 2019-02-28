const handover=()=>import('./handover.vue');
export default [{
    path:'handover',
    name:'handover',
    component:handover,
    meta:{
        label:'交班单',
        breadcrumbHide:false,
        limit: 'shiftchange:receive'
    }
}]