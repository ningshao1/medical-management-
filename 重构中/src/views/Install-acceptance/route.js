const index = () => import('./index.vue');
const list = () => import('./list');
const detail = () => import('./detail');
export default [{
    name: 'install',
    path: "/install",
    redirect: { name: 'install-list' },
    meta: {
        label: '安装验收列表',


    },
    component: index,
    children: [{
        name: "install-list",
        path: "install-list",
        meta: {
            breadcrumbHide: true,
            label: '安装验收列表',
        },
        component: list,
    }, {
        name: "install-detail",
        path: "install-detail",
        meta: {
            label: '新增安装验收'
        },
        component: detail,
    }]
}]