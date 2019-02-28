const adjust = () => import('./index.vue')
const adjustList = () => import('./adjust-list/adjust-list.vue') //左侧导航
const applyList = () => import('./borrow-apply/list.vue') //申请审批列表
const borrowList = () => import('./borrow/borrow-list.vue') //借用列表
import borrowRoute from './borrow/route';//借用路由
import assetTransfer from './asset-transfer/route.js';//设备转移路由
import assetUnused from './asset-unused/route.js';//闲置设备路由
import applyRoute from './borrow-apply/route';//申请审批路由
import assetByLife from './asset-by-life/route.js';

import assetExamineImg from './borrow-apply/image/闲置设备.png';
export default [{
    path: 'adjust',
    component: adjust,
    redirect: { name: 'adjustList' },
    name: 'adjust',
    meta: {
        label: '设备调剂',
        breadcrumbHide: true
    },
    children: [
        {
            path: 'adjustList',
            name: 'adjustList',
            component: adjustList,
            meta: {
                label: '设备调剂列表',
                breadcrumbHide: true
            },
            children: [
                {
                    path: 'borrow',
                    name: 'asset-borrow',
                    component: borrowList,
                    meta: {
                        label: '设备借用列表',
                        imgUrl: require('../image/borrow-list.png')
                    }
                },
                ...assetTransfer.list
                ,
                ...assetUnused.list
                , {
                    path: 'examine',
                    name: 'asset-examine',
                    component: applyList,
                    meta: {
                        label: '借用申请列表',
                        imgUrl: assetExamineImg
                    }
                },
                ...assetByLife.list
            ],
        },
        ...applyRoute,
        ...borrowRoute,
        ...assetTransfer.detail,
        ...assetUnused.detail
    ]
}]

