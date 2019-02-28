const transferList=()=>import('./list.vue');
const transferDetail=()=>import('./asset-transfer-detail.vue');
let transfer=require('../../image/设备转移.png')
const route={
    list:[
        {
            path: 'transfer',
            name: 'asset-transfer',
            component:transferList,
            meta: {
                label: '设备转移列表',
                imgUrl:transfer
            }
        }
    ],
    detail:[
        {
            path: 'transferDetail',
            component: { render: h => h('router-view') },
            redirect: { name: 'asset-transfer' },
            meta: {
                label: "设备转移列表"
            },
            children: [{
                path: 'transferDetail',
                name: 'transfer-detail',
                component: transferDetail,
                meta: {
                    label: '设备转移详情',
                    imgUrl:transfer
                }
            }]
        }
    ]
};
export default route