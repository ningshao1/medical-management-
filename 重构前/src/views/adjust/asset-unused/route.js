const unusedList=()=>import('./list.vue');
const unusedDetail=()=>import('./asset-unused-detail.vue');
let unused=require("../../image/闲置设备.png")
const route={
    list:[{
        path: 'unused',
        name: 'asset-unused',
        component: unusedList,
        meta: {
            label: '闲置设备列表',
            imgUrl:unused
        }
    }],
    detail:[{
        path: 'unusedDetail',
        component:unusedDetail,
        redirect: { name: 'asset-unused' },
        meta: {
            label: "闲置设备列表",
            
        },
        children: [{
            path: 'unusedDetail',
            name: 'unused-detail',
            component: unusedDetail,
            meta: {
                label: '闲置设备详情',
                imgUrl:unused
            }
        }]
    }]
}
export default route;