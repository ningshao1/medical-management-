const  AssetHome=()=> import('./home.vue') ;
const  AssetList=()=> import('./asset-list') ;
import AssetDetails from './asset-details/route.js';
const  AssetAddModify=()=> import('./asset-add-modify') ;
export default [
    {
        path:'AssetHome',
        name:'asset-home',
        component:AssetHome,
        redirect:{name:"asset-list"},
        meta:{
            label:"资产目录"
        },
        children:[
            {
                path:'AssetList',
                name:'asset-list',
                component:AssetList,
                meta:{
                    breadcrumbHide:true,
                    label:"资产列表"
                },
            },
            ...AssetDetails,
            {
                path:'AssetAdd',
                name:'asset-add',
                component:AssetAddModify,
                meta:{
                    label:"新增资产"
                },
            },
            {
                path:':id/AssetModify',
                name:'asset-modify',
                component:AssetAddModify,
                meta:{
                    label:"编辑资产"
                },
            },
        ]
        
    }
]