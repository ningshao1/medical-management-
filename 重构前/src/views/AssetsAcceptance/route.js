const AcceptanceList = () => import('./acceptance-list/acceptanceList'); //验收列表
const AssetsAcceptance_ = () => import('./accessptance.vue'); //验收列表
const AddAccessptance = () => import('./add-acceptance/add-acceptance.vue') //添加资产
export default [{
    path: 'AssetsAcceptance_',
    name: 'AssetsAcceptance_',
    component: AssetsAcceptance_,
    meta: {
        label: '安装验收',
        breadcrumbHide: true
    },
    children: [
        {
            path: 'AcceptanceTransfer',
            name: 'AcceptanceTransfer',
            component: { render: h => h('router-view') },
            redirect: { name: 'acceptanceList' },
            meta: {
                label: '安装验收列表',
                imgUrl: require("../image/accept.png"),
            },
            children: [
                {
                    path: 'AcceptanceList',
                    name: 'acceptanceList',
                    component: AcceptanceList,
                    meta: {
                        label: '安装验收列表',
                        breadcrumbHide: true
                    }
                },
                {
                    path: "AddAccessptance",
                    name: "AddAccessptance",
                    component: AddAccessptance,
                    meta: {
                        label: '添加安装验收',
                        imgUrl: require("../image/accept.png"),
                    }
                }]
        }
    ]
}]
