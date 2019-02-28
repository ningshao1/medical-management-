const index = () => import("./index.vue");
const singerCenter = () => import("./singer-center");
const singerCenterImg = require("../../img/singer.svg");
const createSinger = () => import("./create-singer");
const reopenSinger = createSinger;
const createSingerImg = require("./image/add_singer.svg");
const singerDetail = () => import("./singer-detail");

const route = [
    {
        path: "singer-center-home",
        name: "singer-center-home",
        component: index,
        redirect: { name: "singer-center" },
        meta: {
            label: "报单中心",
            breadcrumbHide: false,
            imgUrl: singerCenterImg,
            limit: "fr:list"
        },
        children: [
            {
                path: "singerCenter",
                name: "singer-center",
                component: singerCenter,
                meta: {
                    label: "报单中心主页",
                    breadcrumbHide: true,
                    limit: "fr:list"
                }
            },
            {
                path: "createSinger",
                name: "create-singer",
                component: createSinger,
                meta: {
                    label: "新建报单",
                    breadcrumbHide: false,
                    imgUrl: createSingerImg,
                    limit: "fr:add"
                }
            },

            {
                path: "singerDetail",
                name: "singer-detail",
                component: singerDetail,
                meta: {
                    label: "报单详情",
                    breadcrumbHide: false,
                    limit: "fr:query"
                }
            },
            {
                path: "reopenSinger/:id",
                name: "reopen-singer",
                component: reopenSinger,
                meta: {
                    label: "重新打开报单",
                    breadcrumbHide: false,
                    imgUrl: createSingerImg,
                }
            }
        ]
    }
];
export default route;
