const assetByLifeList=()=>import('../asset-unused/list.vue');
// const assetByLifeList=()=>import('../../home/news-information/news-information.vue');
let assetByLife=require("../../image/生命支持类设备.png");
const route={
    list:[{
        path: 'assetByLife',
        name: 'asset-by-life',
        component: assetByLifeList,
        meta: {
            label: '急救生命支持类设备列表',
            imgUrl:assetByLife
        }
    }],
}
export default route;