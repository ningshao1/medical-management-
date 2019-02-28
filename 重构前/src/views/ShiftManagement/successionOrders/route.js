const successionOrders=()=>import('../handover/handover.vue');
export default [{
    path:'successionOrders',
    name:'successionOrders',
    component:successionOrders,
    meta:{
        label:'接班单',
        breadcrumbHide:false,
        limit: 'shiftchange:delivery'
    }
}]