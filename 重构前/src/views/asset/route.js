let home=()=>import('./index.vue');
let asset=()=>import("./asset-home");
let assetDetail=()=>import('./newAssetDetails/newAssetDetails.vue');
let assetInfo=()=>import('./newAddAsset/addAsset.vue');
let addAsset=()=>import('./newAddAsset/addAsset.vue');

let assetSvg = require("../../img/asset.svg");
let add_z=require('../../img/add_z.svg')


const route=[
    {
        path:"asset",
        name:"asset",
        component:home,
        redirect:{name:"asset-home"},
        meta:{
            label: '资产目录',
            breadcrumbHide:false,
            imgUrl:assetSvg,
            limit:'ass:list'
        },
        children:[
            {
                path:"assetHome",
                name:"asset-home",
                component:asset,
                meta:{
                    label:"资产目录主页",
                    breadcrumbHide:true,
                    limit:'ass:list'
                }
            },
            {
                path:"addAsset",
                name:"add-asset",
                component:addAsset,
                meta:{
                    label:"资产管理",
                    breadcrumbHide:false,
                    imgUrl:add_z,
                    limit:'ass:add'
                }
            },
            {
                path:":id/assetDetails",
                name:"asset-details",
                component:assetDetail,
                meta:{
                    label:"资产详情",
                    breadcrumbHide:false,
                    limit:"ass:query"
                }
            },
            {
                path:":id/assetConfig",
                name:"asset-config",
                component:assetInfo,
                meta:{
                    label:"编辑资产",
                    breadcrumbHide:false,
                    limit:'ass:add'
                }
            }
        ]
        
    }

]
export default route